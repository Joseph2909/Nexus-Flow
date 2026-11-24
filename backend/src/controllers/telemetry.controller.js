
const mongoose = require("mongoose");

const getTelemetry = async (req, res) => {
    try {
        const requestedLimit = req.query.limit === undefined
            ? 50
            : Number(req.query.limit);

        if (!Number.isInteger(requestedLimit) || requestedLimit < 1 || requestedLimit > 100) {
            return res.status(400).json({
                success: false,
                message: "Limit must be an integer between 1 and 100"
            });
        }

        const { deviceId } = req.query;

        if (deviceId !== undefined && (typeof deviceId !== "string" || !deviceId.trim())) {
            return res.status(400).json({
                success: false,
                message: "deviceId must be a non-empty string"
            });
        }

        const filter = deviceId
            ? { "metadata.deviceId": deviceId.trim() }
            : {};

        const telemetry = await mongoose.connection.db
            .collection("telemetry")
            .find(filter, {
                projection: {
                    metadata: 1,
                    temperature: 1,
                    vibration: 1,
                    pressure: 1,
                    timestamp: 1
                }
            })
            .sort({ timestamp: -1 })
            .limit(requestedLimit)
            .toArray();

        return res.status(200).json({
            success: true,
            count: telemetry.length,
            data: telemetry.map((reading) => ({
                id: reading._id,
                deviceId: reading.metadata?.deviceId,
                temperature: reading.temperature,
                vibration: reading.vibration,
                pressure: reading.pressure,
                timestamp: reading.timestamp
            }))
        });
    } catch (error) {
        console.error("Telemetry Retrieval Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve telemetry data"
        });
    }
};

const ingestTelemetry = async (req, res) => {
    try {
        const { deviceId, temperature, vibration, pressure } = req.body;

        // Validate required fields
        if (!deviceId || typeof deviceId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid deviceId is required"
            });
        }

        const measurements = [temperature, vibration, pressure];

        if (measurements.some(
            value => typeof value !== "number" || !Number.isFinite(value)
        )) {
            return res.status(400).json({
                success: false,
                message: "Temperature, vibration and pressure must be numbers"
            });
        }

        const db = mongoose.connection.db;

        const result = await db.collection("telemetry").insertOne({
            metadata: {
                deviceId
            },
            temperature,
            vibration,
            pressure,
            timestamp: new Date()
        });

        return res.status(201).json({
            success: true,
            message: "Telemetry data saved successfully",
            data: {
                id: result.insertedId,
                deviceId,
                temperature,
                vibration,
                pressure
            }
        });

    } catch (error) {
        console.error("Telemetry Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save telemetry data"
        });
    }
};

module.exports = { getTelemetry, ingestTelemetry };
