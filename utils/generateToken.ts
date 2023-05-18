import jwt from 'jsonwebtoken';

export const generateToken = (id: string, time: string | number) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: time,
  });
};
