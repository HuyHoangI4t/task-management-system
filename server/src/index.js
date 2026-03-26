const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");
const { env } = require("./config/env");
const { setupSwagger } = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

setupSwagger(app, env.PORT);

app.get("/", (_req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
  console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
});