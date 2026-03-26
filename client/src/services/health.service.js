import http from "../api/http";

export const getHealth = async () => {
  const response = await http.get("/health");
  return response.data;
};
