const taskService = require("../services/task.service");

const getTasks = (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Lấy danh sách công việc thành công",
    data: taskService.getTasks()
  });
};

const createTask = (req, res, next) => {
  try {
    const data = taskService.createTask(req.body);
    return res.status(201).json({
      success: true,
      message: "Tạo công việc thành công",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const updateTaskStatus = (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const data = taskService.updateTaskStatus(taskId, status);
    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const { taskId } = req.params;
    const data = taskService.deleteTask(taskId);
    return res.status(200).json({
      success: true,
      message: "Xóa công việc thành công",
      data
    });
  } catch (error) {
    return next(error);
  }
};

const getTaskSummary = (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Lấy thống kê công việc thành công",
    data: taskService.getSummary()
  });
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getTaskSummary
};
