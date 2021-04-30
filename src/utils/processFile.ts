import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@fast-csv/parse';
import { createObjectCsvWriter } from 'csv-writer';
import { IDataRow, IProccessFile } from '../model';
import Helpers from './helpers';

export default class ProcessFile {
  private filePath;
  constructor({ filePath }: IProccessFile) {
    this.filePath = path.resolve(filePath);
  }

  setFilePath(filePath: string) {
    if (filePath) {
      this.filePath = path.resolve(filePath);
    }
  }

  readFilePromise(): Promise<IDataRow[]> {
    const dataRow: IDataRow[] = [];
    if (!this.filePath) {
      throw new Error('Input file .csv not found');
    }
    return new Promise((resolve, reject) => {
      fs.createReadStream(this.filePath)
        .pipe(parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', row => {
          dataRow.push(row);
        })
        .on('end', (rowCount: number) => {
          console.log(`Parsed ${rowCount} rows`)
          resolve(dataRow);
        });
    });
  }

  async writeFileAsync(header: any, data: any) {
    const outPath = Helpers.getOutPath(this.filePath);
    const csvWriter = createObjectCsvWriter({
      path: outPath,
      header
    })
    try {
      const result = await csvWriter.writeRecords(data);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
