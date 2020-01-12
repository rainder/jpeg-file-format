import { FileFormat } from './types';
import { Segment } from './file-segments/types';
import ExifSegment from './file-segments/exif.segment';
import RawSegment from './file-segments/raw.segment';
import ScanSegment from './file-segments/scan.segment';
import BufferReader from './utils/buffer-reader';
import { fallback } from './utils/fallback';
import { suitch } from './utils/suitch';

const JPEG_HEADER_START = 0xFF;
const JPEG_IMAGE_START = 0xD8;
const JPEG_SCAN_START = 0xDA;
const JPEG_IMAGE_END = 0xD9;

export const JPEG_MARKER_START = Buffer.from([JPEG_HEADER_START, JPEG_IMAGE_START]);
export const JPEG_MARKER_SCAN = Buffer.from([JPEG_HEADER_START, JPEG_SCAN_START]);
export const JPEG_MARKER_END = Buffer.from([JPEG_HEADER_START, JPEG_IMAGE_END]);

export default class JPEGFileFormat implements FileFormat {
  static readonly SEGMENT_MARKER_EXIF = 0xE1;

  constructor(
    readonly segments: Array<Segment>,
  ) {

  }

  /**
   *
   * @param {Buffer} contents
   * @returns {JPEGFileFormat}
   */
  static load(contents: Buffer): JPEGFileFormat {
    const reader = new BufferReader(contents);
    const segments: Array<Segment> = [];

    if (
      reader.readBytes(2).compare(JPEG_MARKER_START) ||
      reader.clone().move(reader.buffer.length - 2).readBytes(2).compare(JPEG_MARKER_END)
    ) {
      throw new Error('invalid jpeg');
    }

    while (reader.hasMore()) {
      const segmentMarker = reader.readUInt8();
      const segmentIdentifier = reader.readUInt8();

      if (segmentMarker !== JPEG_HEADER_START) {
        throw new Error('invalid marker');
      }

      switch (segmentIdentifier) {
        case JPEG_IMAGE_END:
          continue;
        case JPEG_SCAN_START: {
          const data = reader.readBytes(reader.buffer.length - 2 - reader.pos());

          segments.push(new ScanSegment(segmentIdentifier, data));

          break;
        }
        default: {
          const length = reader.readUInt16();
          const data = reader.readBytes(length - 2);
          const createRawSegment = () => new RawSegment(segmentIdentifier, data);

          const value = fallback([
            () => suitch<Segment>(segmentIdentifier, {
              [0xE1]: () => new ExifSegment(segmentIdentifier, data),
            }),
            () => createRawSegment(),
          ]);

          segments.push(value);
        }

      }
    }

    return new JPEGFileFormat(segments);
  }

  /**
   *
   * @param {number} segmentMarker
   * @returns {Buffer | null}
   */
  findSegment(segmentMarker: 0xE1): ExifSegment | null;
  findSegment(segmentMarker: number): Segment | null {
    return this.segments.find((segment) => {
      return segment.id === segmentMarker;
    }) || null;
  }

  /**
   *
   * @returns {Buffer}
   */
  toBuffer(): Buffer {
    const segmentBuffers = this.segments.map((segment) => segment.toBuffer());

    return Buffer.concat([
      JPEG_MARKER_START,
      ...segmentBuffers,
      JPEG_MARKER_END,
    ]);
  }
}
