
const mongoose = require("mongoose");

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

module.exports = { ingestTelemetry };
