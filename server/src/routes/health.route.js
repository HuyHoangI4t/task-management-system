const { Router } = require("express");
const { getHealth } = require("../controllers/health.controller");

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Kiểm tra trạng thái server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server hoạt động bình thường
 */
router.get("/", getHealth);

module.exports = router;
