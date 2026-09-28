// normalizers.js - Normalize backend GeoJSON schemas to frontend structure

export function normalizeLocation(location) {
  if (!location) return { lat: 0, lng: 0 };
  
  // Handle GeoJSON Point: location.coordinates = [longitude, latitude]
  if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    return {
      lat: Number(location.coordinates[1]),
      lng: Number(location.coordinates[0]),
      address: location.address || ''
    };
  }

  // Handle direct lat/lng or latitude/longitude
  if (typeof location.lat === 'number' && typeof location.lng === 'number') {
    return {
      lat: location.lat,
      lng: location.lng,
      address: location.address || ''
    };
  }

  if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
    return {
      lat: location.latitude,
      lng: location.longitude,
      address: location.address || ''
    };
  }

  return { lat: 0, lng: 0, address: location.address || '' };
}

export function normalizeEvent(event) {
  if (!event) return null;
  return {
    ...event,
    observationId: event.observationId || event._id,
    location: normalizeLocation(event.location)
  };
}

export function normalizeBus(bus) {
  if (!bus) return null;
  const normLocation = normalizeLocation(bus.location);
  return {
    ...bus,
    busId: bus.busId || bus._id,
    route: bus.route || '',
    status: bus.status === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
    location: normLocation,
    lastLocation: normLocation, // Backward compatibility for map markers
    speed: typeof bus.speed === 'number' ? bus.speed : 0,
    lastSeenAt: bus.lastSeenAt || new Date().toISOString()
  };
}
