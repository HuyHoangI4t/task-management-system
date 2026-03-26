const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const setupSwagger = (app, port) => {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Task Management System API",
        version: "1.0.0",
        description: "Tài liệu API cho dự án quản lý công việc"
      },
      servers: [
        {
          url: `http://localhost:${port}`
        }
      ]
    },
    apis: ["./src/routes/health.route.js", "./src/routes/task.route.js"]
  };

  const swaggerSpecs = swaggerJsdoc(swaggerOptions);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
  });
};

module.exports = {
  setupSwagger
};

