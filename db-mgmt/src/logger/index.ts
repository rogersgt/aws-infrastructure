import winston from 'winston';

const {
  LOG_LEVEL = 'info',
  IS_OFFLINE,
} = process.env;

const logger = winston.createLogger({
  level: LOG_LEVEL,
  // eslint-disable-next-line max-len
  format: !IS_OFFLINE ? winston.format.json() : winston.format.combine(winston.format.json(), winston.format.prettyPrint()),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;
