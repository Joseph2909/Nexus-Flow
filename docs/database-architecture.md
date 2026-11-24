
# NexusFlow – Database Architecture

## 1. Project Overview

NexusFlow is an IoT telemetry monitoring and automation platform.

The database stores device metadata and time-series sensor measurements.

## 2. Database Technology

- Database: MongoDB Community Server
- Database Name: nexusflow
- Backend: Node.js and Express.js
- Database Integration: Mongoose
- Time-Series Storage: MongoDB Time-Series Collection

## 3. Database Structure

Database: nexusflow

### Collection 1: devices

Stores IoT device metadata.

Fields:

| Field | Type | Description |
|---|---|---|
| _id | ObjectId | Unique document ID |
| deviceId | String | Unique device identifier |
| deviceName | String | Device name |
| deviceType | String | Device category |
| location | Object | Building and section |
| sensors | Array | Supported sensor names |
| status | String | Device status |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### Collection 2: telemetry

MongoDB Time-Series collection storing sensor measurements.

Configuration:

- timeField: timestamp
- metaField: metadata
- granularity: seconds
- bucketMaxSpanSeconds: 3600

Measurement fields:

| Field | Type | Description |
|---|---|---|
| timestamp | Date | Measurement time |
| metadata.deviceId | String | Associated device |
| temperature | Number | Temperature reading |
| vibration | Number | Vibration reading |
| pressure | Number | Pressure reading |

## 4. Sample Device Document

{
  "deviceId": "TURBINE-001",
  "deviceName": "Industrial Turbine 001",
  "deviceType": "Turbine",
  "location": {
    "building": "Factory-A",
    "section": "Production"
  },
  "sensors": [
    "temperature",
    "vibration",
    "pressure"
  ],
  "status": "active"
}

## 5. Sample Telemetry Document

{
  "timestamp": "2026-11-23T15:05:48.917Z",
  "metadata": {
    "deviceId": "TURBINE-001"
  },
  "temperature": 86.5,
  "vibration": 3.1,
  "pressure": 2.0
}

## 6. Backend Integration

Telemetry API:

GET /api/telemetry?deviceId=TURBINE-001&limit=50

- `deviceId` is optional.
- `limit` is optional, defaults to 50, and accepts integers from 1 to 100.
- Results are sorted newest-first and include the device ID, measurements, and timestamp.

POST /api/telemetry

Request fields:

- deviceId
- temperature
- vibration
- pressure

The Express backend receives telemetry data and stores it in the MongoDB Time-Series collection.
The Analytics page reads telemetry through the GET endpoint and displays the returned measurements.

## 7. Database Testing

The following tests were performed:

1. MongoDB connection verification.
2. Time-Series collection configuration verification.
3. Device metadata insertion and retrieval.
4. Telemetry API ingestion testing.
5. Device-based telemetry retrieval.
6. Timestamp-based telemetry retrieval.
7. Newest-first sorting.
8. Telemetry record counting.
9. Invalid device ID query testing.

## 8. Test Results

The database and API checks above were previously reported successful. During Week 1 frontend integration verification, the backend health endpoint returned success, telemetry retrieval for `TURBINE-001` returned three records, and an invalid limit returned HTTP 400. The Analytics page rendered those retrieved readings in the browser.

## 9. Conclusion

The NexusFlow database environment, device metadata storage,
Time-Series telemetry storage, and backend telemetry ingestion
workflow have been implemented and tested successfully.
