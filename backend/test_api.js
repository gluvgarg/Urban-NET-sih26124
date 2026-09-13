const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(`http://127.0.0.1:5000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testEndpoints() {
  console.log('Testing APIs...');
  
  const endpoints = [
    '/api/health',
    '/api/dashboard/overview',
    '/api/buses',
    '/api/buses/BUS_01',
    '/api/buses/BUS_01/telemetry',
    '/api/events',
    '/api/events/EVT_001324',
    '/api/road-conditions',
    '/api/road-conditions/potholes',
    '/api/road-conditions/waterlogging',
    '/api/infrastructure',
    '/api/infrastructure/footpaths',
    '/api/traffic/current',
    '/api/traffic/observations',
    '/api/traffic/congestion',
    '/api/incidents',
    '/api/incidents/INC_00982',
    '/api/map/events',
    '/api/analytics/summary',
    '/api/analytics/events-by-type',
    '/api/analytics/events-by-day',
    '/api/analytics/bus-performance',
    '/api/analytics/congestion'
  ];

  for (const ep of endpoints) {
    try {
      const res = await get(ep);
      console.log(`[PASS] GET ${ep} -> Status ${res.status}`);
    } catch (err) {
      console.error(`[FAIL] GET ${ep} -> ${err.message}`);
    }
  }

  // Test Demo Event Generation (First detection)
  console.log('\nTesting Demo Event Generation (Pothole at MG Road)...');
  const demoRes1 = await post('/api/demo/generate-event', {
    type: 'POTHOLE',
    busId: 'BUS_01',
    location: 'MG Road, Sector 14',
    latitude: 28.6139,
    longitude: 77.2090
  });
  console.log('Demo Result 1:', demoRes1.status, demoRes1.data?.event?.id, 'Deduplicated:', demoRes1.data?.isDuplicate);

  // Test Demo Event Generation (Second detection at same spot -> Geo Deduplicated!)
  console.log('\nTesting Geo Deduplication (Second Pothole detection nearby at MG Road)...');
  const demoRes2 = await post('/api/demo/generate-event', {
    type: 'POTHOLE',
    busId: 'BUS_07',
    location: 'MG Road, Sector 14',
    latitude: 28.6140, // 10 meters away
    longitude: 77.2091
  });
  console.log('Demo Result 2:', demoRes2.status, demoRes2.data?.event?.id, 'Deduplicated:', demoRes2.data?.isDuplicate, 'DetectionCount:', demoRes2.data?.entityDetails?.detectionCount);

  // Test Hit and Run Demo Event Generation
  console.log('\nTesting Hit & Run Demo Event Generation...');
  const demoRes3 = await post('/api/demo/generate-event', {
    type: 'HIT_AND_RUN',
    busId: 'BUS_17',
    location: 'Dhaula Kuan Slip Road',
    latitude: 28.5921,
    longitude: 77.1612
  });
  console.log('Demo Result 3:', demoRes3.status, demoRes3.data?.event?.id, 'Offending vehicle:', demoRes3.data?.aiResult?.offendingVehicle?.registrationNo);
}

testEndpoints();
