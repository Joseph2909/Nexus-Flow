const mongoose = require("mongoose");
const Rule = require("../models/rule.model");
const { validateRule } = require("../utils/rule-validation");

const createRule = async (req, res) => {
    const validationError = validateRule(req.body);

    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError
        });
    }

    try {
        const rule = await Rule.create({
            name: req.body.name.trim(),
            description: req.body.description?.trim() || "",
            enabled: req.body.enabled ?? false,
            schemaVersion: 1,
            workflow: req.body.workflow,
            compiledDefinition: null
        });

        return res.status(201).json({
            success: true,
            data: rule
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A rule with this name already exists"
            });
        }

        console.error("Rule Creation Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create rule"
        });
    }
};

const getRules = async (req, res) => {
    try {
        const rules = await Rule.find({})
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: rules.length,
            data: rules
        });
    } catch (error) {
        console.error("Rule Retrieval Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve rules"
        });
    }
};

const getRuleById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid rule id"
        });
    }

    try {
        const rule = await Rule.findById(req.params.id).lean();

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: "Rule not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: rule
        });
    } catch (error) {
        console.error("Rule Retrieval Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve rule"
        });
    }
};

module.exports = { createRule, getRules, getRuleById };
