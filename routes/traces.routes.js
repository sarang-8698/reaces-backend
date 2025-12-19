const { Router } = require("express");
const router = Router();

const { getTraces, getMetrics } = require("../controllers/traces.controller");

router.get("/", getTraces);

router.get("/metrics", getMetrics);

module.exports = router;
