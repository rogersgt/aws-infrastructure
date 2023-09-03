import { deleteSystemSnapshot, listSystemSnapshots, updateRootPassword } from './services/rds';
import { differenceInCalendarDays } from 'date-fns';
import logger from './logger';
import { generate } from 'generate-password';
import { upsertParameter } from './services/ssm';

const { INSTANCE_ID } = process.env;

export const rotateSnapshots = async () => {
  // if (!INSTANCE_ID) {
  //   throw new Error('INSTANCE_ID is not defined');
  // }
  const now = new Date();
  logger.debug(`Rotating snapshots at ${now}`);
  const backups = await listSystemSnapshots();
  logger.debug(`Found ${backups.length} backups`);
  const olderBackups = backups.length > 1 ? backups.filter((b) => {
    logger.debug({ b });
    const daysOld = differenceInCalendarDays(now, b.RestoreWindow?.LatestTime ?? new Date());
    return daysOld > 2;
  }) : [];

  if (olderBackups.length) {
    logger.debug(`Removing ${olderBackups.length} system backups`);
    await Promise.all(olderBackups.map(async (b) => {
      if (!b.DBInstanceAutomatedBackupsArn) return;
      await deleteSystemSnapshot(b.DBInstanceAutomatedBackupsArn)
    }));
  } else {
    logger.debug('No older backups found. Skipping snapshot rotation');
  }
};

export async function rotateRootPassword() {
  if (!INSTANCE_ID) {
    throw new Error('INSTANCE is not defined');
  }

  const newPassword = generate({
    numbers: true,
    exclude: '@/:',
    length: 20,
    symbols: true,
  });
  await updateRootPassword(INSTANCE_ID, newPassword);
  await upsertParameter('/ci/rds/root/password', newPassword, true);
}
