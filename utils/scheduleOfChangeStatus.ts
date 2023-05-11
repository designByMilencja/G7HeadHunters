import { UserDb } from '../models/UserSchema';
import { CronJob } from 'cron';

export const job = new CronJob('* * * * *', async () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const usersToUpdate = await UserDb.find({
    'status.status': 'W trakcie rozmowy',
    updatedAt: { $lt: tenDaysAgo },
  });

  await Promise.all(
    usersToUpdate.map((user) => {
      user.status.status = 'Dostępny';
      return user.save();
    })
  );
});
