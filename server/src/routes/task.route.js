const { Router } = require("express");
const {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getTaskSummary
} = require("../controllers/task.controller");

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Quản lý công việc
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Lấy danh sách công việc
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Danh sách công việc
 */
router.get("/", getTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Tạo công việc mới
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Thiết kế trang dashboard
 *               description:
 *                 type: string
 *                 example: Hoàn thành wireframe trước thứ 6
 *               assignee:
 *                 type: string
 *                 example: Duyên
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *     responses:
 *       201:
 *         description: Tạo công việc thành công
 */
router.post("/", createTask);

/**
 * @swagger
 * /api/tasks/{taskId}/status:
 *   patch:
 *     summary: Cập nhật trạng thái công việc
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.patch("/:taskId/status", updateTaskStatus);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Xóa công việc
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa công việc thành công
 */
router.delete("/:taskId", deleteTask);

/**
 * @swagger
 * /api/tasks/summary:
 *   get:
 *     summary: Lấy thống kê công việc theo trạng thái
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Thống kê công việc
 */
router.get("/summary", getTaskSummary);

module.exports = router;
