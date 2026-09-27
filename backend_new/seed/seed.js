require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const Event = require('../models/Event');
const connectDB = require('../config/db');

const seedBuses = [
  {
    busId: 'BUS_001',
    route: 'DTC-413',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.2167, 28.6289] },
    speed: 32,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_002',
    route: 'DTC-534',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.2410, 28.5672] },
    speed: 28,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_003',
    route: 'DTC-620',
    status: 'OFFLINE',
    location: { type: 'Point', coordinates: [77.2065, 28.5494] },
    speed: 0,
    lastSeenAt: new Date(Date.now() - 3600000)
  },
  {
    busId: 'BUS_004',
    route: 'DTC-717',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.2100, 28.5660] },
    speed: 40,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_005',
    route: 'DTC-813',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.1200, 28.7041] },
    speed: 35,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_006',
    route: 'DTC-340',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.0688, 28.5921] },
    speed: 45,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_007',
    route: 'DTC-511',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.2300, 28.6139] },
    speed: 22,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_008',
    route: 'DTC-425',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.1900, 28.6500] },
    speed: 18,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_009',
    route: 'DTC-724',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.2280, 28.6660] },
    speed: 30,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_010',
    route: 'DTC-505',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.2400, 28.6280] },
    speed: 25,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_011',
    route: 'DTC-615',
    status: 'OFFLINE',
    location: { type: 'Point', coordinates: [77.2000, 28.5200] },
    speed: 0,
    lastSeenAt: new Date(Date.now() - 7200000)
  },
  {
    busId: 'BUS_012',
    route: 'DTC-419',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.2750, 28.6300] },
    speed: 38,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_013',
    route: 'DTC-544',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.1700, 28.5900] },
    speed: 42,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_014',
    route: 'DTC-764',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.1500, 28.5400] },
    speed: 33,
    lastSeenAt: new Date()
  },
  {
    busId: 'BUS_015',
    route: 'DTC-817',
    status: 'ONLINE',
    location: { type: 'Point', coordinates: [77.0800, 28.6300] },
    speed: 29,
    lastSeenAt: new Date()
  }
];

const seedEvents = [
  {
    observationId: 'obs_delhi_101',
    busId: 'BUS_001',
    category: 'ROAD',
    type: 'POTHOLE',
    handling: 'PERSISTENT',
    severity: 'HIGH',
    confidence: 0.94,
    location: { type: 'Point', coordinates: [77.2170, 28.6295] },
    capturedAt: new Date(Date.now() - 86400000),
    status: 'NEW',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 4,
    detectedBy: ['BUS_001', 'BUS_002', 'BUS_004'],
    firstDetectedAt: new Date(Date.now() - 86400000 * 2),
    lastDetectedAt: new Date(Date.now() - 3600000)
  },
  {
    observationId: 'obs_delhi_102',
    busId: 'BUS_002',
    category: 'ROAD',
    type: 'WATERLOGGING',
    handling: 'PERSISTENT',
    severity: 'CRITICAL',
    confidence: 0.98,
    location: { type: 'Point', coordinates: [77.2320, 28.6310] },
    capturedAt: new Date(Date.now() - 43200000),
    status: 'ACKNOWLEDGED',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 6,
    detectedBy: ['BUS_002', 'BUS_007', 'BUS_010'],
    firstDetectedAt: new Date(Date.now() - 86400000),
    lastDetectedAt: new Date(Date.now() - 1800000)
  },
  {
    observationId: 'obs_delhi_103',
    busId: 'BUS_009',
    category: 'SAFETY',
    type: 'HIT_AND_RUN',
    handling: 'REAL_TIME',
    severity: 'CRITICAL',
    confidence: 0.96,
    location: { type: 'Point', coordinates: [77.2285, 28.6665] },
    capturedAt: new Date(Date.now() - 1800000),
    status: 'NEW',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600' },
    model: { name: 'YOLOv8-Safety', version: '2.0.1' },
    detectionCount: 1,
    detectedBy: ['BUS_009'],
    firstDetectedAt: new Date(Date.now() - 1800000),
    lastDetectedAt: new Date(Date.now() - 1800000)
  },
  {
    observationId: 'obs_delhi_104',
    busId: 'BUS_005',
    category: 'INFRASTRUCTURE',
    type: 'MISSING_SIGNBOARD',
    handling: 'PERSISTENT',
    severity: 'LOW',
    confidence: 0.88,
    location: { type: 'Point', coordinates: [77.1205, 28.7045] },
    capturedAt: new Date(Date.now() - 172800000),
    status: 'NEW',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 1,
    detectedBy: ['BUS_005'],
    firstDetectedAt: new Date(Date.now() - 172800000),
    lastDetectedAt: new Date(Date.now() - 172800000)
  },
  {
    observationId: 'obs_delhi_105',
    busId: 'BUS_008',
    category: 'INFRASTRUCTURE',
    type: 'DAMAGED_DIVIDER',
    handling: 'PERSISTENT',
    severity: 'MEDIUM',
    confidence: 0.91,
    location: { type: 'Point', coordinates: [77.1910, 28.6505] },
    capturedAt: new Date(Date.now() - 86400000),
    status: 'IN_PROGRESS',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 3,
    detectedBy: ['BUS_008', 'BUS_001'],
    firstDetectedAt: new Date(Date.now() - 172800000),
    lastDetectedAt: new Date(Date.now() - 86400000)
  },
  {
    observationId: 'obs_delhi_106',
    busId: 'BUS_006',
    category: 'SAFETY',
    type: 'RASH_DRIVING',
    handling: 'REAL_TIME',
    severity: 'HIGH',
    confidence: 0.92,
    location: { type: 'Point', coordinates: [77.0690, 28.5925] },
    capturedAt: new Date(Date.now() - 7200000),
    status: 'ACKNOWLEDGED',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600' },
    model: { name: 'YOLOv8-Safety', version: '2.0.1' },
    detectionCount: 1,
    detectedBy: ['BUS_006'],
    firstDetectedAt: new Date(Date.now() - 7200000),
    lastDetectedAt: new Date(Date.now() - 7200000)
  },
  {
    observationId: 'obs_delhi_107',
    busId: 'BUS_003',
    category: 'ROAD',
    type: 'DAMAGED_ROAD',
    handling: 'PERSISTENT',
    severity: 'MEDIUM',
    confidence: 0.87,
    location: { type: 'Point', coordinates: [77.2070, 28.5498] },
    capturedAt: new Date(Date.now() - 259200000),
    status: 'RESOLVED',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 2,
    detectedBy: ['BUS_003', 'BUS_011'],
    firstDetectedAt: new Date(Date.now() - 259200000),
    lastDetectedAt: new Date(Date.now() - 172800000)
  },
  {
    observationId: 'obs_delhi_108',
    busId: 'BUS_001',
    category: 'SAFETY',
    type: 'PEDESTRIAN_RISK',
    handling: 'REAL_TIME',
    severity: 'CRITICAL',
    confidence: 0.97,
    location: { type: 'Point', coordinates: [77.2165, 28.6285] },
    capturedAt: new Date(Date.now() - 900000),
    status: 'NEW',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600' },
    model: { name: 'YOLOv8-Safety', version: '2.0.1' },
    detectionCount: 1,
    detectedBy: ['BUS_001'],
    firstDetectedAt: new Date(Date.now() - 900000),
    lastDetectedAt: new Date(Date.now() - 900000)
  },
  {
    observationId: 'obs_delhi_109',
    busId: 'BUS_012',
    category: 'TRAFFIC',
    type: 'ILLEGAL_PARKING',
    handling: 'REAL_TIME',
    severity: 'LOW',
    confidence: 0.85,
    location: { type: 'Point', coordinates: [77.2755, 28.6305] },
    capturedAt: new Date(Date.now() - 14400000),
    status: 'RESOLVED',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=600' },
    model: { name: 'YOLOv8-Traffic', version: '1.0.0' },
    detectionCount: 1,
    detectedBy: ['BUS_012'],
    firstDetectedAt: new Date(Date.now() - 14400000),
    lastDetectedAt: new Date(Date.now() - 14400000)
  },
  {
    observationId: 'obs_delhi_110',
    busId: 'BUS_014',
    category: 'INFRASTRUCTURE',
    type: 'BROKEN_STREETLIGHT',
    handling: 'PERSISTENT',
    severity: 'LOW',
    confidence: 0.89,
    location: { type: 'Point', coordinates: [77.1505, 28.5405] },
    capturedAt: new Date(Date.now() - 345600000),
    status: 'NEW',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 2,
    detectedBy: ['BUS_014'],
    firstDetectedAt: new Date(Date.now() - 345600000),
    lastDetectedAt: new Date(Date.now() - 86400000)
  },
  {
    observationId: 'obs_delhi_111',
    busId: 'BUS_004',
    category: 'ROAD',
    type: 'POTHOLE',
    handling: 'PERSISTENT',
    severity: 'MEDIUM',
    confidence: 0.90,
    location: { type: 'Point', coordinates: [77.2105, 28.5665] },
    capturedAt: new Date(Date.now() - 5400000),
    status: 'IN_PROGRESS',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 5,
    detectedBy: ['BUS_004', 'BUS_002'],
    firstDetectedAt: new Date(Date.now() - 172800000),
    lastDetectedAt: new Date(Date.now() - 5400000)
  },
  {
    observationId: 'obs_delhi_112',
    busId: 'BUS_013',
    category: 'INFRASTRUCTURE',
    type: 'UNGUARDED_CONSTRUCTION',
    handling: 'PERSISTENT',
    severity: 'HIGH',
    confidence: 0.93,
    location: { type: 'Point', coordinates: [77.1705, 28.5905] },
    capturedAt: new Date(Date.now() - 10800000),
    status: 'ACKNOWLEDGED',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 3,
    detectedBy: ['BUS_013', 'BUS_008'],
    firstDetectedAt: new Date(Date.now() - 86400000),
    lastDetectedAt: new Date(Date.now() - 10800000)
  },
  {
    observationId: 'obs_delhi_113',
    busId: 'BUS_015',
    category: 'ROAD',
    type: 'SPEED_BREAKER_DAMAGED',
    handling: 'PERSISTENT',
    severity: 'LOW',
    confidence: 0.86,
    location: { type: 'Point', coordinates: [77.0805, 28.6305] },
    capturedAt: new Date(Date.now() - 432000000),
    status: 'NEW',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600' },
    model: { name: 'YOLOv8-Urban', version: '1.2.0' },
    detectionCount: 1,
    detectedBy: ['BUS_015'],
    firstDetectedAt: new Date(Date.now() - 432000000),
    lastDetectedAt: new Date(Date.now() - 432000000)
  },
  {
    observationId: 'obs_delhi_114',
    busId: 'BUS_010',
    category: 'SAFETY',
    type: 'ACCIDENT_PRONE_DEBRIS',
    handling: 'REAL_TIME',
    severity: 'HIGH',
    confidence: 0.95,
    location: { type: 'Point', coordinates: [77.2405, 28.6285] },
    capturedAt: new Date(Date.now() - 3600000),
    status: 'NEW',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600' },
    model: { name: 'YOLOv8-Safety', version: '2.0.1' },
    detectionCount: 1,
    detectedBy: ['BUS_010'],
    firstDetectedAt: new Date(Date.now() - 3600000),
    lastDetectedAt: new Date(Date.now() - 3600000)
  },
  {
    observationId: 'obs_delhi_115',
    busId: 'BUS_007',
    category: 'TRAFFIC',
    type: 'TRAFFIC_CONGESTION',
    handling: 'REAL_TIME',
    severity: 'MEDIUM',
    confidence: 0.89,
    location: { type: 'Point', coordinates: [77.2305, 28.6145] },
    capturedAt: new Date(Date.now() - 7200000),
    status: 'IN_PROGRESS',
    evidence: { imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=600' },
    model: { name: 'YOLOv8-Traffic', version: '1.0.0' },
    detectionCount: 1,
    detectedBy: ['BUS_007'],
    firstDetectedAt: new Date(Date.now() - 7200000),
    lastDetectedAt: new Date(Date.now() - 7200000)
  }
];

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await connectDB();

    console.log('[Seed] Clearing existing collections (buses, events)...');
    await Bus.deleteMany({});
    await Event.deleteMany({});

    console.log('[Seed] Inserting buses...');
    const insertedBuses = await Bus.insertMany(seedBuses);
    console.log(`[Seed] Successfully inserted ${insertedBuses.length} buses.`);

    console.log('[Seed] Inserting events...');
    const insertedEvents = await Event.insertMany(seedEvents);
    console.log(`[Seed] Successfully inserted ${insertedEvents.length} events.`);

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
