"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateSnapshots = void 0;
const rds_1 = require("./services/rds");
const date_fns_1 = require("date-fns");
const logger_1 = __importDefault(require("./logger"));
const rotateSnapshots = async () => {
    const now = new Date();
    logger_1.default.debug(`Rotating snapshots at ${now}`);
    const backups = await (0, rds_1.listSystemSnapshots)();
    logger_1.default.debug(`Found ${backups.length} backups`);
    const olderBackups = backups.length > 1 ? backups.filter((b) => {
        logger_1.default.debug({ b });
        const daysOld = (0, date_fns_1.differenceInCalendarDays)(now, b.RestoreWindow?.LatestTime ?? new Date());
        return daysOld > 2;
    }) : [];
    if (olderBackups.length) {
        logger_1.default.debug(`Removing ${olderBackups.length} system backups`);
        await Promise.all(olderBackups.map(async (b) => {
            if (!b.DBInstanceAutomatedBackupsArn)
                return;
            await (0, rds_1.deleteSystemSnapshot)(b.DBInstanceAutomatedBackupsArn);
        }));
    }
    else {
        logger_1.default.debug('No older backups found. Skipping snapshot rotation');
    }
};
exports.rotateSnapshots = rotateSnapshots;
//# sourceMappingURL=index.js.map