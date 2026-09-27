# Urban Net - Backend Service (SIH 2026 - Problem Statement SIH26124)

Lightweight, high-performance Node.js / Express / MongoDB / Socket.IO backend for real-time transit telemetry and Edge AI incident ingestion.

---

## 🏗️ Architecture & Data Flow

```
Edge AI on Bus ──> Express Backend ──> Validate Event ──> Spatial Deduplication ──> MongoDB Atlas
                                                                                   │
                                                                                   └──> Socket.IO ──> frontend_new
```

- **Express Backend**: Acts as the single source of truth.
- **MongoDB Atlas + Mongoose**: Manages unified `buses` and `events` collections with 2dsphere geospatial indexing.
- **Deduplication Engine**: Automatically deduplicates persistent road defects (e.g., potholes, waterlogging) within a 50m spatial radius.
- **Socket.IO**: Emits real-time updates (`event:new`, `event:updated`, `bus:updated`) to `frontend_new`.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Mongoose (GeoJSON + 2dsphere indexing)
- **Real-Time WebSockets**: Socket.IO
- **Environment Management**: dotenv
- **CORS**: cors middleware

---

## 📦 Project Structure

```
backend_new/
├── config/
│   └── db.js                 # MongoDB connection handler
├── models/
│   ├── Bus.js                # Bus telemetry model (2dsphere index)
│   └── Event.js              # Unified event model (2dsphere index)
├── controllers/
│   ├── eventController.js    # Event ingestion & CRUD handlers
│   ├── busController.js      # Bus telemetry handlers
│   └── dashboardController.js# Summary analytics handler
├── routes/
│   ├── edgeRoutes.js         # POST /api/v1/edge/events
│   ├── eventRoutes.js        # GET / PATCH /api/v1/events
│   ├── busRoutes.js          # GET / POST / PATCH /api/v1/buses
│   └── dashboardRoutes.js    # GET /api/v1/dashboard/summary
├── services/
│   ├── eventService.js       # Core ingestion orchestration
│   └── deduplicationService.js# Geospatial persistent event deduplication
├── middleware/
│   └── errorHandler.js      # Centralized error handling & 404 handler
├── sockets/
│   └── socket.js             # Socket.IO emitter module
├── utils/
│   └── validators.js         # Edge payload validator & normalizer
├── seed/
│   └── seed.js               # Database seed script
├── app.js                    # Express application setup
├── server.js                 # HTTP & Socket.IO server startup
├── .env.example              # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend_new` directory (see `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/urban_net?retryWrites=true&w=majority
DB_NAME=urban_net
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> **Note**: Replace `MONGODB_URI` with your actual MongoDB Atlas connection URI. Never commit credentials to version control.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd backend_new
npm install
```

### 2. Seed Database
Populate MongoDB Atlas with realistic demo data (buses & events):
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```
Or start in production mode:
```bash
npm start
```

---

## 📡 API Endpoints Reference

### 1. Edge AI Ingestion

#### `POST /api/v1/edge/events`
Ingests detection events from bus Edge AI hardware. Updates bus telemetry automatically.

**Payload Example:**
```json
{
  "observationId": "obs_delhi_999",
  "busId": "BUS_001",
  "category": "ROAD",
  "type": "POTHOLE",
  "handling": "PERSISTENT",
  "severity": "HIGH",
  "confidence": 0.96,
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "capturedAt": "2026-09-27T10:30:00Z",
  "evidence": {
    "imageUrl": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7"
  },
  "model": {
    "name": "YOLOv8-Urban",
    "version": "1.2.0"
  },
  "speed": 32.5
}
```

---

### 2. Events API

#### `GET /api/v1/events`
Query events with filtering and pagination.

**Query Parameters:**
- `category` (`ROAD`, `INFRASTRUCTURE`, `SAFETY`, `TRAFFIC`)
- `type` (e.g. `POTHOLE`, `WATERLOGGING`, `HIT_AND_RUN`)
- `severity` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- `status` (`NEW`, `ACKNOWLEDGED`, `IN_PROGRESS`, `RESOLVED`)
- `handling` (`REAL_TIME`, `PERSISTENT`)
- `busId` (e.g. `BUS_001`)
- `from` / `to` (ISO dates)
- `page` (default `1`)
- `limit` (default `20`, max `100`)

#### `GET /api/v1/events/:id`
Get event details by Mongoose `_id` or `observationId`.

#### `PATCH /api/v1/events/:id/status`
Update status of an event (`NEW`, `ACKNOWLEDGED`, `IN_PROGRESS`, `RESOLVED`).
**Body:** `{ "status": "IN_PROGRESS" }`

---

### 3. Buses API

#### `GET /api/v1/buses`
Get list of buses. Supports filtering by `status` (`ONLINE`/`OFFLINE`) or `route`.

#### `GET /api/v1/buses/:busId`
Get single bus telemetry record.

#### `POST /api/v1/buses`
Create or update bus record.

#### `PATCH /api/v1/buses/:busId`
Update bus status, speed, or location.

---

### 4. Dashboard Summary API

#### `GET /api/v1/dashboard/summary`
Returns dashboard metrics:
```json
{
  "success": true,
  "data": {
    "activeBusCount": 12,
    "totalEventCount": 25,
    "criticalEventCount": 3,
    "persistentEventCount": 18,
    "recentEvents": [...]
  }
}
```

---

### 5. Health Check API

#### `GET /api/health`
Returns connection status:
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## ⚡ Real-Time WebSockets (Socket.IO)

Clients connect to the Socket.IO server on port `5000`.

**Events Emitted by Server:**
- `event:new`: Fired when a new event (Real-Time or first-seen Persistent) is created.
- `event:updated`: Fired when an event status changes or a persistent event is deduplicated.
- `bus:updated`: Fired whenever a bus updates its location, speed, or online status.

---

## 🧠 Deduplication & Idempotency Logic

1. **Idempotency**:
   - Every ingested event includes an `observationId`.
   - If an `observationId` is ingested multiple times (network retries), the server returns the existing record without creating duplicates.

2. **Real-Time Events**:
   - Events flagged `handling: "REAL_TIME"` (e.g. `HIT_AND_RUN`, `RASH_DRIVING`, `PEDESTRIAN_RISK`) immediately create a new event record and emit `event:new`.

3. **Persistent Events**:
   - Events flagged `handling: "PERSISTENT"` (e.g. `POTHOLE`, `WATERLOGGING`, `DAMAGED_DIVIDER`) query MongoDB Atlas using `$nearSphere` on the `2dsphere` index for existing unresolved events of the same `type` within a **50-meter radius**.
   - **If match found**:
     - Increment `detectionCount`.
     - Append `busId` to `detectedBy` array if new bus.
     - Update `lastDetectedAt` and confidence.
     - Emit `event:updated`.
   - **If no match found**:
     - Insert new `Event` document with `detectionCount: 1`.
     - Emit `event:new`.
