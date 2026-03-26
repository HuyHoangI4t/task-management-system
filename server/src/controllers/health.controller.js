const healthService = require("../services/health.service");
const { sendSuccess } = require("../utils/response");

const getHealth = (_req, res) => {
  const data = healthService.getHealth();
  return sendSuccess(res, data, "Health check success");
};

module.exports = { getHealth };
