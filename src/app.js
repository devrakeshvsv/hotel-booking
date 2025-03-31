const express = require("express");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const { morgan } = require("./config");
const { ApiError } = require("./utils");
const { errorMiddleware } = require("./middlewares");

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());
app.use(mongoSanitize());

app.use(cors());

const routes = require("./routes");
app.use("/api", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorMiddleware.errorConverter);
app.use(errorMiddleware.errorHandler);

module.exports = app;
