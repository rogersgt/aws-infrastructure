"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSystemSnapshot = exports.listSystemSnapshots = void 0;
const client_rds_1 = require("@aws-sdk/client-rds");
const rdsClient = new client_rds_1.RDSClient();
async function listSystemSnapshots() {
    const cmd = new client_rds_1.DescribeDBInstanceAutomatedBackupsCommand({
        MaxRecords: 100
    });
    const { DBInstanceAutomatedBackups: backups } = await rdsClient.send(cmd);
    return backups || [];
}
exports.listSystemSnapshots = listSystemSnapshots;
async function deleteSystemSnapshot(arn) {
    const cmd = new client_rds_1.DeleteDBInstanceAutomatedBackupCommand({
        DBInstanceAutomatedBackupsArn: arn,
    });
    await rdsClient.send(cmd);
}
exports.deleteSystemSnapshot = deleteSystemSnapshot;
//# sourceMappingURL=rds.js.map