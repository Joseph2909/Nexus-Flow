
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

## 7. Week 2 Rule Contract — Day 2 Design

This section defines the Week 2 Day 2 contract for the frontend, backend, and
database work. Rule persistence, validation, and compilation are not implemented yet.

### Workflow payload

The frontend submits a graph as part of a rule:

```json
{
  "name": "High temperature alert",
  "description": "Notify when turbine temperature is high",
  "enabled": false,
  "workflow": {
    "nodes": [
      {
        "id": "node-1",
        "type": "condition",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "Temperature threshold",
          "description": "Compare a sensor value",
          "config": { "operator": ">", "value": 80 }
        }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2"
      }
    ]
  }
}
```

Supported node types are `start`, `device`, `sensor`, `condition`, `logic`,
`action`, and `end`. `start` and `end` are editor flow markers. Node `type` and
`data.config` carry machine-readable behavior. Labels and positions are for the
editor and must not determine execution. `data.config` remains JSON so node
configuration can evolve; the backend validator will validate it by node type.
The backend generates any compiled output; clients must not submit trusted
executable code.

### Rule storage requirements

The `rules` collection document shape is:

| Field | Type | Requirement |
|---|---|---|
| `_id` | ObjectId | MongoDB identifier |
| `name` | String | Required, trimmed, non-empty |
| `description` | String | Optional; defaults to empty string |
| `enabled` | Boolean | Defaults to `false` |
| `schemaVersion` | Number | Required; starts at `1` |
| `workflow.nodes` | Array of node objects | Required; each has `id`, `type`, `position`, and `data` |
| `workflow.edges` | Array of edge objects | Required; each has `id`, `source`, and `target` |
| `compiledDefinition` | Object | Optional, server-generated only |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps |

Node and edge IDs are unique within their respective workflow arrays. Edge
endpoints must refer to existing node IDs; full graph and node configuration
validation is handled by the backend validator. Compiled output can be
recreated from the workflow. Execution history is outside this collection and
will be designed separately.

### Backend boundaries and API proposal

- `backend/src/routes/rule.routes.js` maps rule HTTP endpoints.
- `backend/src/controllers/rule.controller.js` handles request/response concerns.
- `backend/src/services/rule.service.js` owns persistence and coordinates validation/compiler modules.
- Validation and compilation remain separate modules so they can be tested independently.
- `POST /api/rules` accepts `name`, optional `description`, optional `enabled`,
  and `workflow`; it returns HTTP 201 with `{ "success": true, "data": rule }`.
- `GET /api/rules` returns HTTP 200 with `{ "success": true, "count": n, "data": [] }`.
- `GET /api/rules/:id` returns HTTP 200 with `{ "success": true, "data": rule }`.
- `PUT /api/rules/:id` accepts the create fields and replaces the editable rule
  fields; it returns HTTP 200 with `{ "success": true, "data": rule }`.
- `DELETE /api/rules/:id` returns HTTP 200 with `{ "success": true, "message": "Rule deleted" }`.
- Invalid input returns HTTP 400; a validly formatted but unknown ID returns
  HTTP 404. Server/database failures return HTTP 500 with a failure response.

The frontend palette in `frontend/src/components/workflow/WorkflowSidebar.jsx`
now uses these node type identifiers and includes initial `data.config`
defaults. Member 1 will preserve this workflow shape when API persistence is
implemented. The Rule model and basic create/list persistence endpoints are implemented
using this contract. The backend validation module validates the name and
workflow graph before Mongoose writes the document. The frontend custom nodes
render distinct types and expose their initial configuration.

## 8. Database Testing

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

## 9. Test Results

The database and API checks above were previously reported successful. During Week 1 frontend integration verification, the backend health endpoint returned success, telemetry retrieval for `TURBINE-001` returned three records, and an invalid limit returned HTTP 400. The Analytics page rendered those retrieved readings in the browser.

## 10. Conclusion

The NexusFlow database environment, device metadata storage,
Time-Series telemetry storage, and backend telemetry ingestion
workflow have been implemented and tested successfully.
