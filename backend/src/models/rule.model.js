const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
    {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    { _id: false }
);

const nodeSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, trim: true },
        type: {
            type: String,
            required: true,
            enum: ["start", "device", "sensor", "condition", "logic", "action", "end"]
        },
        position: { type: positionSchema, required: true },
        data: {
            label: { type: String, required: true, trim: true },
            description: { type: String, trim: true, default: "" },
            config: { type: mongoose.Schema.Types.Mixed, default: {} }
        }
    },
    { _id: false }
);

const edgeSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, trim: true },
        source: { type: String, required: true, trim: true },
        target: { type: String, required: true, trim: true }
    },
    { _id: false }
);

const ruleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },
        enabled: {
            type: Boolean,
            default: false
        },
        schemaVersion: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        },
        workflow: {
            nodes: {
                type: [nodeSchema],
                required: true,
                validate: {
                    validator: (nodes) => nodes.length > 0,
                    message: "A workflow must contain at least one node"
                }
            },
            edges: {
                type: [edgeSchema],
                required: true,
                default: []
            }
        },
        compiledDefinition: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true,
        collection: "rules"
    }
);

ruleSchema.index({ enabled: 1, updatedAt: -1 });
ruleSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Rule", ruleSchema);
