import { Request, Express } from 'express';
import multer from 'multer';
import mime from 'mime';
import path from 'path';
import { v4 as uuid } from 'uuid';

export const storageDir = () => {
  return path.join(__dirname, '../storage');
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(storageDir(), 'csv'));
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()}.${(mime as any).extensions[file.mimetype]}`);
  },
});

export const upload = multer({
  storage,
  fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (file.mimetype == 'text/csv') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Dozwolony jest tylko format plików .csv'));
    }
  },
});
