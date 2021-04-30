import * as path from 'path';

export default class Helpers {
  public static getOutPath(inPath: string) {
    const folderPath = path.dirname(inPath);
    const inFileName = path.basename(inPath, '.csv');
    const epochTime = Math.round(Date.now() / 1000);
    const outFileName = `${inFileName}_${epochTime}.out.csv`;
    const outPath = path.join(folderPath, outFileName);
    return outPath;
  }
}
