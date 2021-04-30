import { Readable } from "stream";
import { IDataRow } from "../model";

export class VirtualDataStream extends Readable {
  private delayInMilliseconds = 1000;
  private pushedCount = 0;
  private isPushedDone = false;
  private processPercent = 0;

  constructor() {
    super({ objectMode: true });
  }

  async pushData(chunkData: IDataRow[][] = []) {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const chunk of chunkData) {
      this.pushedCount++;
      this.processPercent = (this.pushedCount / chunkData.length) * 100;
      if (chunkData.length === this.pushedCount) {
        this.isPushedDone = true;
        this.processPercent = 100;
      }
      // push to stream
      this.push(chunk);
      await delay(this.delayInMilliseconds);
    }
  }

  getProcessPercent() {
    return this.processPercent;
  }

  getIsPushedDone() {
    return this.isPushedDone;
  }

  endPush() {
    this.push(null);
  }

  _read() {}
}
