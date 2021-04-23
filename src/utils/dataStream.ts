import { Readable } from "stream";
import { IDataRow } from "../model";

interface IVirtualDataStreamOption {
  chunkData: IDataRow[][],
  delayInMilliseconds?: number
}

export class VirtualDataStream extends Readable {
  private chunkData: IDataRow[][] = [];
  private delayInMilliseconds = 1000;
  private pushedCount = 0;
  private isPushedDone = false;
  private processPercent = 0;

  constructor({ chunkData = [], delayInMilliseconds = 1000 }: IVirtualDataStreamOption) {
    super({ objectMode: true });

    this.chunkData = chunkData;
    this.delayInMilliseconds = delayInMilliseconds;
  }

  async pushData() {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const chunk of this.chunkData) {
      this.pushedCount++;
      this.processPercent = (this.pushedCount / this.chunkData.length) * 100;
      if (this.chunkData.length === this.pushedCount) {
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
