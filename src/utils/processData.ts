import { IDataRow } from "../model";

interface IProcessToChunksParam {
  inputData: IDataRow[];
  maxChunk: number;
  destCityName?: string;
}

export default class ProcessData {

  constructor() {}

  processToChunks({ inputData = [], maxChunk = 10, destCityName }: IProcessToChunksParam) {
    if (destCityName) {
      inputData = inputData.map(item => {
        return {...item, destAddr: `${item.wardName}, ${item.districtName}, ${destCityName}`}
      });
    }
    let startIndex = 0;
    let curChunk = inputData.slice(startIndex, maxChunk);
    const chunks = [curChunk];
    while (curChunk.length) {
      startIndex = startIndex + maxChunk;
      const lastIndex = startIndex + maxChunk;
      curChunk = inputData.slice(startIndex, lastIndex);
      if (curChunk.length) {
        chunks.push(curChunk);
      }
    }

    return chunks;
  }
}

