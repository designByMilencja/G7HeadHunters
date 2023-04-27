import { Router } from 'express';
const multer = require('multer');

const upload = multer({
  dest: 'uploads/csv', // docelowy katalog dla plików CSV
});
import {importCsv} from "../controllers/adminController";

export const adminRouter = Router();
adminRouter.post('/api/upload-csv', upload.single('csvFile'), importCsv)
