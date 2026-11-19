
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const telemetryRoutes = require("./src/routes/telemetry.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NexusFlow Backend is Running"
    });
});

// Telemetry API
app.use("/api/telemetry", telemetryRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`NexusFlow Server running on port ${PORT}`);
    });
};

startServer();
