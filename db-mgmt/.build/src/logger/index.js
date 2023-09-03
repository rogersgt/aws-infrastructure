"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { LOG_LEVEL = 'info', IS_OFFLINE, } = process.env;
const logger = winston_1.default.createLogger({
    level: LOG_LEVEL,
    format: !IS_OFFLINE ? winston_1.default.format.json() : winston_1.default.format.combine(winston_1.default.format.json(), winston_1.default.format.prettyPrint()),
    transports: [
        new winston_1.default.transports.Console(),
    ],
});
exports.default = logger;
//# sourceMappingURL=index.js.map