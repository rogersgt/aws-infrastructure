import {
  RDSClient,
  DescribeDBInstanceAutomatedBackupsCommand,
  DeleteDBInstanceAutomatedBackupCommand,
} from '@aws-sdk/client-rds';

const rdsClient = new RDSClient();

export async function listSystemSnapshots() {
  const cmd = new DescribeDBInstanceAutomatedBackupsCommand({
    MaxRecords: 100,
  });
  const { DBInstanceAutomatedBackups: backups } = await rdsClient.send(cmd);
  return backups || [];
}

export async function deleteSystemSnapshot(arn: string) {
  const cmd = new DeleteDBInstanceAutomatedBackupCommand({
    DBInstanceAutomatedBackupsArn: arn,
  });
  await rdsClient.send(cmd);
}
