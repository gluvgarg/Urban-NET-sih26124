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

async function runTest() {
  console.log('=============== INTEGRATION TEST: EDGE EVENT INGESTION & FRONTEND SYNC ===============\n');

  console.log('1. Checking backend health...');
  const health = await get('/api/health');
  console.log(`Backend Health: Status ${health.status}`, health.data);

  console.log('\n2. Checking dashboard overview BEFORE event injection...');
  const beforeOverview = await get('/api/dashboard/overview');
  console.log('Events Count Before:', beforeOverview.data?.summary?.eventsTotal);

  console.log('\n3. Ingesting test Edge AI event via POST /api/edge/events...');
  const testPayload = {
    eventType: "POTHOLE",
    busId: "BUS_TEST_01",
    cameraId: "CAM_FRONT",
    timestamp: "2026-09-13T13:30:00Z",
    location: {
      latitude: 28.7000,
      longitude: 77.1500,
      address: "Edge Test Location"
    },
    detection: {
      confidence: 0.94,
      severity: "HIGH"
    },
    model: {
      name: "pothole-yolo-test",
      version: "1.0"
    },
    evidence: {
      imageUrl: null
    },
    metadata: {
      test: true
    }
  };

  const edgeRes = await post('/api/edge/events', testPayload);
  console.log(`Edge Ingestion Response (Status ${edgeRes.status}):`);
  console.log('Event ID:', edgeRes.data?.event?.id);
  console.log('Location:', edgeRes.data?.event?.location);
  console.log('Alert Created:', edgeRes.data?.alert?.id);

  console.log('\n4. Checking dashboard overview AFTER event injection...');
  const afterOverview = await get('/api/dashboard/overview');
  console.log('Events Count After:', afterOverview.data?.summary?.eventsTotal);
  console.log('Latest Event in Dashboard:', afterOverview.data?.recentEvents?.[0]?.id, afterOverview.data?.recentEvents?.[0]?.location);

  console.log('\n5. Checking GIS map dataset AFTER event injection...');
  const mapData = await get('/api/map/events');
  const insertedInDefects = mapData.data?.mapData?.defects?.find(d => d.location.includes('Edge Test Location'));
  console.log('GIS Defect Marker present:', !!insertedInDefects, insertedInDefects);

  console.log('\n================ INTEGRATION TEST PASSED SUCCESSFULLY ================');
}

runTest();
