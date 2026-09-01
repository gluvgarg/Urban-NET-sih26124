// City-Agnostic Configuration Model
// Default demo configuration set to Delhi NCR (SIH BEL context), easily swappable for any municipality

export const CITY_CONFIG = {
  cityName: "Delhi NCR",
  regionName: "National Capital Region, India",
  authorityName: "Delhi Urban Mobility & Transport Authority",
  commandCenterName: "URBAN SENSE - Intelligence Command Center",
  center: [28.6139, 77.2090], // Latitude, Longitude (New Delhi center)
  zoom: 12,
  bounds: [
    [28.4800, 77.0500], // South-West
    [28.7500, 77.3500]  // North-East
  ],
  keyCorridors: [
    "MG Road (Sector 14 - Cyber Hub)",
    "Inner Ring Road (AIIMS - Dhaula Kuan)",
    "Outer Ring Road (Nehru Place - Munirka)",
    "NH-48 Corridor (Mahipalpur Expressway)",
    "Connaught Place Radial (Barakhamba - Janpath)"
  ],
  districts: [
    "Central Zone",
    "South District",
    "West Sector",
    "North Gateway",
    "East Corridor"
  ]
};
