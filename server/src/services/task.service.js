const Task = require("../models/task.model");

const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

const normalizeTask = (task) => ({
  ...task.toObject(),
  priorityLabel:
    task.priority === PRIORITY.HIGH ? "Cao" : task.priority === PRIORITY.MEDIUM ? "Trung bình" : "Thấp",
  statusLabel:
    task.status === TASK_STATUS.DONE
      ? "Hoàn thành"
      : task.status === TASK_STATUS.IN_PROGRESS
        ? "Đang làm"
        : "Cần làm",
});

const getTasks = async () => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return tasks.map(normalizeTask);
};

const createTask = async ({ title, description = "", assignee = "", priority = PRIORITY.MEDIUM }) => {
  if (!title?.trim()) {
    const error = new Error("Tiêu đề công việc là bắt buộc");
    error.statusCode = 400;
    throw error;
  }

  if (![PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH].includes(priority)) {
    const error = new Error("Độ ưu tiên không hợp lệ");
    error.statusCode = 400;
    throw error;
  }

  const newTask = new Task({
    title: title.trim(),
    description: description.trim(),
    assignee: assignee.trim(),
    priority,
    status: TASK_STATUS.TODO,
  });

  await newTask.save();
  return normalizeTask(newTask);
};

const updateTaskStatus = async (taskId, status) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error("Công việc không tồn tại");
    error.statusCode = 404;
    throw error;
  }

  if (![TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE].includes(status)) {
    const error = new Error("Trạng thái không hợp lệ");
    error.statusCode = 400;
    throw error;
  }

  task.status = status;
  await task.save();
  return normalizeTask(task);
};

const deleteTask = async (taskId) => {
  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) {
    const error = new Error("Công việc không tồn tại");
    error.statusCode = 404;
    throw error;
  }
  return normalizeTask(deletedTask);
};

const getSummary = async () => {
  const total = await Task.countDocuments();
  const todo = await Task.countDocuments({ status: TASK_STATUS.TODO });
  const in_progress = await Task.countDocuments({ status: TASK_STATUS.IN_PROGRESS });
  const done = await Task.countDocuments({ status: TASK_STATUS.DONE });

  return {
    total,
    todo,
    in_progress,
    done,
  };
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getSummary,
};
