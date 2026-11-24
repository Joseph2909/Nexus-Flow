
const express = require("express");

const {
    getTelemetry,
    ingestTelemetry
} = require("../controllers/telemetry.controller");

const router = express.Router();

router.get("/", getTelemetry);
router.post("/", ingestTelemetry);

module.exports = router;
