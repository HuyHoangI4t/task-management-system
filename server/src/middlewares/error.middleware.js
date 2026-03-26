const { MESSAGES } = require("../resources/messages");

const notFoundHandler = (_req, _res, next) => {
  const error = new Error(MESSAGES.NOT_FOUND);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || MESSAGES.INTERNAL_SERVER_ERROR
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
