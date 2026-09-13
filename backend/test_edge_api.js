const http = require('http');

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

async function testEdgeApi() {
  console.log('=============== TESTING EDGE AI API (POST /api/edge/events) ===============\n');

  // 1. Exact sample payload from prompt
  const samplePayload = {
    eventType: "POTHOLE",
    busId: "BUS_17",
    cameraId: "CAM_FRONT",
    timestamp: "2026-09-13T13:20:00Z",
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: "MG Road, Sector 14"
    },
    detection: {
      confidence: 0.94,
      severity: "HIGH"
    },
    model: {
      name: "pothole-yolo",
      version: "1.0"
    },
    evidence: {
      imageUrl: null
    },
    metadata: {}
  };

  console.log('1. Sending exact sample Edge AI event payload...');
  const res1 = await post('/api/edge/events', samplePayload);
  console.log(`Status: ${res1.status}`);
  console.log('Response:', JSON.stringify(res1.data, null, 2));

  // 2. Test Geo Deduplication (Second Edge detection nearby at MG Road)
  console.log('\n2. Sending nearby Edge AI event for Geo Deduplication check...');
  const samplePayload2 = {
    ...samplePayload,
    busId: "BUS_07",
    location: {
      latitude: 28.6140, // ~10m away
      longitude: 77.2091,
      address: "MG Road, Sector 14"
    }
  };
  const res2 = await post('/api/edge/events', samplePayload2);
  console.log(`Status: ${res2.status}`);
  console.log('Response (Deduplicated):', res2.data.isDuplicate, 'Detection count:', res2.data.entityDetails?.detectionCount);

  // 3. Test Hit-and-Run Edge AI Event
  console.log('\n3. Sending Hit-and-Run Edge AI event payload...');
  const hitAndRunPayload = {
    eventType: "HIT_AND_RUN",
    busId: "BUS_31",
    cameraId: "CAM_FRONT",
    timestamp: "2026-09-13T13:25:00Z",
    location: {
      latitude: 28.5672,
      longitude: 77.2100,
      address: "Inner Ring Road near AIIMS Flyover"
    },
    detection: {
      confidence: 0.96,
      severity: "CRITICAL"
    },
    model: {
      name: "deep-sort-anpr",
      version: "2.1"
    },
    evidence: {
      imageUrl: null
    },
    metadata: {
      registrationNo: "DL01AB9999",
      makeModel: "Sedan (White)",
      speedDetected: "88 km/h"
    }
  };
  const res3 = await post('/api/edge/events', hitAndRunPayload);
  console.log(`Status: ${res3.status}`);
  console.log('Response (Hit & Run):', res3.data.event?.id, 'Alert created:', res3.data.alert?.id);

  // 4. Test Validation Errors (400 Bad Request)
  console.log('\n4. Testing Validation Error Handling (invalid eventType)...');
  const invalidTypeRes = await post('/api/edge/events', { ...samplePayload, eventType: "INVALID_TYPE" });
  console.log(`Status: ${invalidTypeRes.status} (Expected 400)`);
  console.log('Errors:', invalidTypeRes.data.errors);

  console.log('\n5. Testing Validation Error Handling (invalid latitude)...');
  const invalidLatRes = await post('/api/edge/events', { ...samplePayload, location: { latitude: 120, longitude: 77.2 } });
  console.log(`Status: ${invalidLatRes.status} (Expected 400)`);
  console.log('Errors:', invalidLatRes.data.errors);

  console.log('\n================ EDGE AI API VERIFICATION COMPLETE ================');
}

testEdgeApi();
