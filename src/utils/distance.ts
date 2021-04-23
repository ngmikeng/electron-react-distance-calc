import { Client } from "@googlemaps/google-maps-services-js";
import { IDataRow, IDistanceResult } from "../model";

interface IDistanceCalculatorOption {
  apiKey: string;
}

interface ICalcDistChunks { chunkData: IDataRow[], fromAddr: string }

export class DistanceCalculator {
  private client;
  private apiKey;
  constructor({ apiKey }: IDistanceCalculatorOption) {
    this.apiKey = apiKey;
    this.client = new Client({ });
  }

  async simpleDistance({ fromAddr, toAddrs }: { fromAddr: string, toAddrs: string[] }): Promise<IDistanceResult> {
    try {
      const result = await this.client.distancematrix({
        params: {
          key: this.apiKey,
          origins: [fromAddr],
          destinations: toAddrs
        },
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async calcDistanceChunks({ chunkData, fromAddr }: ICalcDistChunks) {
    try {
      const toAddrs = chunkData.map<string>(item => item.destAddr || 'UNKNOWN');
      const distanceResult = await this.simpleDistance({
        fromAddr,
        toAddrs
      });
      const destAddrs = distanceResult.destination_addresses;
      const originAddr = distanceResult.origin_addresses[0];
      const distElements = distanceResult.rows[0].elements;
      // write new file csv
      const chunkNewData = chunkData.map((item, index) => {
        let ggDistance = 'UNKNOWN', ggDuration = 'UNKNOWN';
        if (distElements[index] && distElements[index].status === 'OK') {
          ggDistance = distElements[index].distance.text;
          ggDuration = distElements[index].duration.text
        }
        return {
          ...item,
          ggOriginAddr: originAddr,
          ggDestAddr: destAddrs[index],
          ggDistance,
          ggDuration
        };
      });
      return chunkNewData;
    } catch (err) {
      throw err;
    }
  }

  async calcDistanceChunksFake({ chunkData, fromAddr }: ICalcDistChunks) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const toAddrs = chunkData.map<string>(item => item.destAddr || 'UNKNOWN');
      // write new file csv
      const chunkNewData = chunkData.map((item, index) => {
        return {
          ...item,
          ggOriginAddr: 'GG ORIGIN ADDRESS',
          ggDestAddr: 'GG DEST ADDRESS',
          ggDistance: '10 km',
          ggDuration: '2 hours'
        };
      });
      return chunkNewData;
    } catch (err) {
      throw err;
    }
  }

}
