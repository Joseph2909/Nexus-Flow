
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully");

        const db = mongoose.connection.db;
        const collections = await db.listCollections({
            name: "telemetry"
        }).toArray();

        if (collections.length === 0) {
            await db.createCollection("telemetry", {
                timeseries: {
                    timeField: "timestamp",
                    metaField: "metadata",
                    granularity: "seconds"
                }
            });

            console.log("Telemetry Time-Series Collection Created");
        } else {
            console.log("Telemetry Collection Already Exists");
        }

    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
