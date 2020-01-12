export interface Segment {
  id: number;
  data: Buffer;

  toBuffer(): Buffer;
}
