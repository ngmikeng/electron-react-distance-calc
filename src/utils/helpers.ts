import * as path from 'path';

export default class Helpers {
  public static getOutPath(inPath: string) {
    const folderPath = path.dirname(inPath);
    const inFileName = path.basename(inPath, '.csv');
    const outFileName = `${inFileName}.out.csv`;
    const outPath = path.join(folderPath, outFileName);
    return outPath;
  }
}
