import http from "../api/http";

export const getTasks = async () => {
  const response = await http.get("/tasks");
  return response.data.data;
};

export const createTask = async (payload) => {
  const response = await http.post("/tasks", payload);
  return response.data.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await http.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};

export const deleteTask = async (taskId) => {
  const response = await http.delete(`/tasks/${taskId}`);
  return response.data.data;
};

export const getTaskSummary = async () => {
  const response = await http.get("/tasks/summary");
  return response.data.data;
};
