const SUPPORTED_NODE_TYPES = new Set([
    "start",
    "device",
    "sensor",
    "condition",
    "logic",
    "action",
    "end"
]);

const SENSOR_FIELDS = new Set(["temperature", "vibration", "pressure"]);
const CONDITION_OPERATORS = new Set([">", "<", ">=", "<=", "==", "!="]);
const LOGIC_OPERATORS = new Set(["AND", "OR"]);
const ACTION_TYPES = new Set(["webhook", "sms", "notification"]);

const isObject = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);

const validateNodeConfig = (node) => {
    const config = node.data?.config;

    if (config !== undefined && !isObject(config)) {
        return "Node data.config must be an object";
    }

    if (node.type === "device" && config?.deviceId !== undefined) {
        if (typeof config.deviceId !== "string" || !config.deviceId.trim()) {
            return "Device node deviceId must be a non-empty string";
        }
    }

    if (node.type === "sensor" && config?.field !== undefined &&
        !SENSOR_FIELDS.has(config.field)) {
        return "Sensor node field must be temperature, vibration, or pressure";
    }

    if (node.type === "condition" && config !== undefined) {
        if (config.operator !== undefined &&
            !CONDITION_OPERATORS.has(config.operator)) {
            return "Condition node has an unsupported operator";
        }
        if (config.value !== undefined &&
            (typeof config.value !== "number" || !Number.isFinite(config.value))) {
            return "Condition node value must be a finite number";
        }
    }

    if (node.type === "logic" && config?.operator !== undefined &&
        !LOGIC_OPERATORS.has(config.operator)) {
        return "Logic node operator must be AND or OR";
    }

    if (node.type === "action" && config?.actionType !== undefined &&
        !ACTION_TYPES.has(config.actionType)) {
        return "Action node actionType must be webhook, sms, or notification";
    }

    return null;
};

const validateRule = (payload) => {
    if (!isObject(payload)) {
        return "Rule payload must be a JSON object";
    }

    if (typeof payload.name !== "string" || !payload.name.trim()) {
        return "Rule name is required";
    }

    if (payload.description !== undefined &&
        typeof payload.description !== "string") {
        return "Rule description must be a string";
    }

    if (payload.enabled !== undefined && typeof payload.enabled !== "boolean") {
        return "Rule enabled must be a boolean";
    }

    if (!isObject(payload.workflow)) {
        return "Rule workflow is required";
    }

    if (!Array.isArray(payload.workflow.nodes) || payload.workflow.nodes.length === 0) {
        return "Workflow nodes must contain at least one node";
    }

    if (!Array.isArray(payload.workflow.edges)) {
        return "Workflow edges must be an array";
    }

    const nodeIds = new Set();

    for (const node of payload.workflow.nodes) {
        if (!isObject(node) ||
            typeof node.id !== "string" ||
            !node.id.trim()) {
            return "Every workflow node must have a non-empty id";
        }
        if (nodeIds.has(node.id)) {
            return "Workflow node ids must be unique";
        }
        nodeIds.add(node.id);

        if (!SUPPORTED_NODE_TYPES.has(node.type)) {
            return `Unsupported workflow node type: ${node.type}`;
        }

        if (!isObject(node.position) ||
            typeof node.position.x !== "number" ||
            typeof node.position.y !== "number") {
            return "Every workflow node must have numeric x and y positions";
        }

        if (!isObject(node.data) ||
            typeof node.data.label !== "string" ||
            !node.data.label.trim()) {
            return "Every workflow node must have a label";
        }

        const configError = validateNodeConfig(node);
        if (configError) {
            return configError;
        }
    }

    const edgeIds = new Set();

    for (const edge of payload.workflow.edges) {
        if (!isObject(edge) ||
            typeof edge.id !== "string" ||
            !edge.id.trim()) {
            return "Every workflow edge must have a non-empty id";
        }
        if (edgeIds.has(edge.id)) {
            return "Workflow edge ids must be unique";
        }
        edgeIds.add(edge.id);

        if (typeof edge.source !== "string" ||
            typeof edge.target !== "string" ||
            !nodeIds.has(edge.source) ||
            !nodeIds.has(edge.target)) {
            return "Every workflow edge must reference existing nodes";
        }
        if (edge.source === edge.target) {
            return "Workflow edges cannot connect a node to itself";
        }
    }

    return null;
};

module.exports = {
    SUPPORTED_NODE_TYPES,
    validateRule
};
