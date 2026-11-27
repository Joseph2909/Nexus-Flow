const express = require("express");
const {
    createRule,
    getRules,
    getRuleById
} = require("../controllers/rule.controller");

const router = express.Router();

router.post("/", createRule);
router.get("/", getRules);
router.get("/:id", getRuleById);

module.exports = router;
