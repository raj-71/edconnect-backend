const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const config = require("config");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
  const db = config.get("db");
  winston.add(
    new winston.transports.MongoDB({
      db: db,
      options: { useUnifiedTopology: true },
    })
  );
};
