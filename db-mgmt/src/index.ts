import { deleteSystemSnapshot, listSystemSnapshots } from './services/rds';
import { differenceInCalendarDays } from 'date-fns';
import logger from './logger';

// const { INSTANCE_ID } = process.env;

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
