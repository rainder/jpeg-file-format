import { numberToBuffer } from '../utils/buffer-utils';
import { Segment } from './types';

export default class ScanSegment implements Segment {
  constructor(
    public id: number,
    public data: Buffer,
  ) {
  }

  toBuffer(): Buffer {
    return Buffer.concat([
      numberToBuffer(1, 0xFF, true),
      numberToBuffer(1, this.id, true),
      this.data,
    ]);
  }
}
