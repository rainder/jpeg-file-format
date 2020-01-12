import { numberToBuffer } from '../utils/buffer-utils';
import { Segment } from './types';

export default class RawSegment implements Segment {
  constructor(
    public id: number,
    public data: Buffer,
  ) {
  }

  toBuffer() {
    return Buffer.concat([
      numberToBuffer(1, 0xFF, true),
      numberToBuffer(1, this.id, true),
      numberToBuffer(2, this.data.length + 2, true),
      this.data,
    ]);
  }
}
