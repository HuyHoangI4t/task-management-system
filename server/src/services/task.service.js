const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done"
};

const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high"
};

const tasks = [
  {
    id: "t1",
    title: "Thiết kế màn hình đăng nhập",
    description: "Tối ưu UI trên mobile",
    assignee: "Duyên",
    priority: PRIORITY.HIGH,
    status: TASK_STATUS.IN_PROGRESS,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: "t2",
    title: "Tạo API lấy danh sách task",
    description: "Hoàn thành và viết Swagger",
    assignee: "An",
    priority: PRIORITY.MEDIUM,
    status: TASK_STATUS.TODO,
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString()
  }
];

const normalizeTask = (task) => ({
  ...task,
  priorityLabel:
    task.priority === PRIORITY.HIGH ? "Cao" : task.priority === PRIORITY.MEDIUM ? "Trung bình" : "Thấp",
  statusLabel:
    task.status === TASK_STATUS.DONE
      ? "Hoàn thành"
      : task.status === TASK_STATUS.IN_PROGRESS
        ? "Đang làm"
        : "Cần làm"
});

const getTasks = () => tasks.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(normalizeTask);

const createTask = ({ title, description = "", assignee = "", priority = PRIORITY.MEDIUM }) => {
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

  const newTask = {
    id: `t${tasks.length + 1}`,
    title: title.trim(),
    description: description.trim(),
    assignee: assignee.trim(),
    priority,
    status: TASK_STATUS.TODO,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  return normalizeTask(newTask);
};

const updateTaskStatus = (taskId, status) => {
  const task = tasks.find((item) => item.id === taskId);
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
  return normalizeTask(task);
};

const deleteTask = (taskId) => {
  const index = tasks.findIndex((item) => item.id === taskId);
  if (index < 0) {
    const error = new Error("Công việc không tồn tại");
    error.statusCode = 404;
    throw error;
  }

  const [deletedTask] = tasks.splice(index, 1);
  return normalizeTask(deletedTask);
};

const getSummary = () => {
  const summary = {
    total: tasks.length,
    todo: 0,
    in_progress: 0,
    done: 0
  };

  tasks.forEach((task) => {
    summary[task.status] += 1;
  });

  return summary;
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getSummary
};
