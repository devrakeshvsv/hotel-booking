// Import packages
const winston = require("winston");
const path = require("path");

// Log format for development
const developmentLogFormatter = winston.format.printf(({ level, timestamp, message, source = "", stack = "" }) => {
  const msg = typeof message !== "string" ? JSON.stringify(message, null, 4) : message;
  return `${timestamp} [${level}] ${source === "" ? "" : `[${source}]`} ${msg} ${stack}`;
});

const developmentLogFormat = winston.format.combine(
  winston.format.errors({
    stack: true,
  }),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS ZZ",
  }),
  winston.format.colorize(),
  developmentLogFormatter
);

// Log format for production
const productionLogFormat = winston.format.combine(
  winston.format.errors({
    stack: true,
  }),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS ZZ",
  }),
  winston.format.json()
);

// Creating logger by Winston
let loggerInstance;
if (process.env.NODE_APP_ENV === "development" || process.env.NODE_APP_ENV === "staging") {
  loggerInstance = winston.createLogger({
    level: "info",
    format: developmentLogFormat,
    transports: [new winston.transports.Console()],
  });
} else {
  loggerInstance = winston.createLogger({
    level: "info",
    format: productionLogFormat,
    transports: [
      new winston.transports.Console({
        format: developmentLogFormat,
      }),
    ],
  });
}

// Function: Get Caller File Name
function getInvokerFile() {
  const originalFunc = Error.prepareStackTrace;

  let callerFile;
  try {
    const err = new Error();

    Error.prepareStackTrace = (_err, stack) => stack;

    const currentFile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerFile = err.stack.shift().getFileName();

      if (currentFile !== callerFile) break;
    }
  } catch (e) {
    //
  }

  Error.prepareStackTrace = originalFunc;

  return path.basename(callerFile).replace(/\.[^/.]+$/, "");
}

// Function: Get Caller Function Name
function getInvokerFunction(d = 2) {
  const error = new Error();
  const functionName = (
    (((error.stack.split("at ") || [])[1 + d] || "").match(/(^|\.| <| )(.*[^(<])( \()/) || [])[2] || ""
  )
    .split(".")
    .pop();
  return functionName !== "<anonymous>" ? functionName : "";
}

const logger = {
  info(message, functionName = getInvokerFunction(), fileName = getInvokerFile()) {
    loggerInstance.info({ source: `${fileName}${functionName ? `.${functionName}` : ""}`, message });
  },
  error(message, functionName = getInvokerFunction(), fileName = getInvokerFile()) {
    loggerInstance.error({ source: `${fileName}${functionName ? `.${functionName}` : ""}`, message });
  },
  warn(message, functionName = getInvokerFunction(), fileName = getInvokerFile()) {
    loggerInstance.warn({ source: `${fileName}${functionName ? `.${functionName}` : ""}`, message });
  },
};

module.exports = logger;
