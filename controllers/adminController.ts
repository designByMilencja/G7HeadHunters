import { Request, Response } from "express";
import { readFile } from "fs/promises";
 import type { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}

export const importCsv = async (req: Request, res: Response) => {
  try {
    const csvFile = req.file;
    const csvFileContent = await readFile(csvFile.path, 'utf-8');
    console.log(csvFileContent);

  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to upload CSV file');
  }
};
