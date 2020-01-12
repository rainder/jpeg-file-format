import { Segment } from './file-segments/types';

export interface FileFormat {
  segments: Array<Segment>;

  toBuffer(): Buffer;
}

export interface FileFormatConstructor {
  new(segments: Array<any>): FileFormat;

  load(contents: Buffer): FileFormat;
}

declare var FileFormat: FileFormatConstructor;
