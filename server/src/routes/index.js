const { Router } = require("express");
const healthRoute = require("./health.route");
const taskRoute = require("./task.route");
const router = Router();

router.use("/health", healthRoute);
router.use("/tasks", taskRoute);

module.exports = router;
