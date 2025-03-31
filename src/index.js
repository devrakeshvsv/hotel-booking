const http = require("http");
const mongoose = require("mongoose");
const { config } = require("./config");
const { logger } = require("./utils");
const app = require("./app");

const server = http.createServer(app);

mongoose.connect(config.mongoose.url).then(() => {
  logger.info("✅ MongoDB Connected");
  server.listen(config.port, () => {
    logger.info("🔥 Hotel Booking Backend");
    logger.info(`- Launched On: http://localhost:${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
