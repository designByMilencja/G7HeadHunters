import { UserDb } from '../models/UserSchema';
import { CronJob } from 'cron';
import { Status } from '../types';

export const job = new CronJob('0 0 * * *', async () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const usersToUpdate = await UserDb.find({
    'status.status': Status.reserved,
    updatedAt: { $lt: tenDaysAgo },
  });

  await Promise.all(
    usersToUpdate.map((user) => {
      user.status.status = Status.available;
      return user.save();
    })
  );
});
