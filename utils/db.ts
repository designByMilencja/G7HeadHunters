import mongoose from 'mongoose';

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to database.');
  } catch (err) {
    console.error(`Connection to database failed. ${err}`);
  }
};
