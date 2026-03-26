import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import MainLayout from "../layouts/MainLayout";
import { APP_TEXT } from "../resources/texts";
import {
  createTask,
  deleteTask,
  getTaskSummary,
  getTasks,
  updateTaskStatus
} from "../services/task.service";
import { formatDate } from "../utils/formatDate";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, todo: 0, in_progress: 0, done: 0 });
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium"
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [taskData, summaryData] = await Promise.all([getTasks(), getTaskSummary()]);
        setTasks(taskData);
        setSummary(summaryData);
      } catch (_err) {
        setError("Không thể tải dữ liệu công việc.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshSummary = (nextTasks) => {
    setSummary({
      total: nextTasks.length,
      todo: nextTasks.filter((item) => item.status === "todo").length,
      in_progress: nextTasks.filter((item) => item.status === "in_progress").length,
      done: nextTasks.filter((item) => item.status === "done").length
    });
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    try {
      const newTask = await createTask({
        title: form.title,
        description: form.description,
        assignee: form.assignee,
        priority: form.priority
      });
      setTasks((prev) => {
        const next = [newTask, ...prev];
        refreshSummary(next);
        return next;
      });
      setForm({ title: "", description: "", assignee: "", priority: "medium" });
    } catch (_err) {
      setError("Tạo công việc thất bại. Vui lòng thử lại.");
    }
  };

  const handleChangeStatus = async (taskId, status) => {
    try {
      const updatedTask = await updateTaskStatus(taskId, status);
      setTasks((prev) => {
        const next = prev.map((item) => (item.id === taskId ? updatedTask : item));
        refreshSummary(next);
        return next;
      });
    } catch (_err) {
      setError("Không thể cập nhật trạng thái.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => {
        const next = prev.filter((item) => item.id !== taskId);
        refreshSummary(next);
        return next;
      });
    } catch (_err) {
      setError("Không thể xóa công việc.");
    }
  };

  const visibleTasks = tasks.filter((task) => (filter === "all" ? true : task.status === filter));

  return (
    <MainLayout>
      <h1>{APP_TEXT.homeTitle}</h1>
      <p>{APP_TEXT.homeDescription}</p>

      <div className="task-summary-grid">
        <section className="card">
          <h2>Tổng quan</h2>
          <div className="summary-list">
            <p>Tổng task: {summary.total}</p>
            <p>Cần làm: {summary.todo}</p>
            <p>Đang làm: {summary.in_progress}</p>
            <p>Hoàn thành: {summary.done}</p>
          </div>
        </section>

        <section className="card">
          <h2>Tạo công việc</h2>
          <form onSubmit={handleCreateTask} className="composer">
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Tên công việc"
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={3}
              placeholder="Mô tả ngắn"
            />
            <input
              value={form.assignee}
              onChange={(event) => setForm((prev) => ({ ...prev, assignee: event.target.value }))}
              placeholder="Người phụ trách"
            />
            <select
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
            >
              <option value="low">Ưu tiên thấp</option>
              <option value="medium">Ưu tiên trung bình</option>
              <option value="high">Ưu tiên cao</option>
            </select>
            <Button type="submit">Thêm task</Button>
          </form>
        </section>
      </div>

      <section className="card">
        <div className="task-filter-row">
          <h2>Danh sách công việc</h2>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">Tất cả</option>
            <option value="todo">Cần làm</option>
            <option value="in_progress">Đang làm</option>
            <option value="done">Hoàn thành</option>
          </select>
        </div>

        {loading && <p>Đang tải công việc...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && visibleTasks.length === 0 && <p>Chưa có công việc nào.</p>}

        <div className="task-list">
          {visibleTasks.map((task) => {
            const nextStatus =
              task.status === "todo"
                ? "in_progress"
                : task.status === "in_progress"
                  ? "done"
                  : "todo";
            const nextStatusLabel =
              nextStatus === "in_progress"
                ? "Chuyển sang Đang làm"
                : nextStatus === "done"
                  ? "Chuyển sang Hoàn thành"
                  : "Chuyển sang Cần làm";

            return (
              <article key={task.id} className="task-item">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`badge ${task.status}`}>{task.statusLabel}</span>
                </div>
                <p>{task.description || "Không có mô tả"}</p>
                <p className="task-meta">
                  <span>Phụ trách: {task.assignee || "Chưa gán"}</span>
                  <span>Ưu tiên: {task.priorityLabel}</span>
                  <span>Tạo lúc: {formatDate(task.createdAt)}</span>
                </p>
                <div className="task-actions">
                  <Button onClick={() => handleChangeStatus(task.id, nextStatus)}>{nextStatusLabel}</Button>
                  <Button onClick={() => handleDeleteTask(task.id)}>Xóa</Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </MainLayout>
  );
}

export default HomePage;
