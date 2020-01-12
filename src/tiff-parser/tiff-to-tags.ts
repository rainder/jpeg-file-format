import * as assert from 'assert';
import BufferReader from '../utils/buffer-reader';
import { getTagCoder, TIFF_FLAG_BIG_END, TIFF_FLAG_LITTLE_END } from './index';
import { Tag } from './tag';
import { TagManager } from './tag-manager';

export const EXIF_IFD_POINTER_MARKER = 0x8769;
export const GPS_INFO_IFD_POINTER_MARKER = 0x8825;

export function tiffToTags(input: Buffer): TagManager {
  const reader = new BufferReader(input);
  reader.bigEnd = isBigEnd(reader.readBytes(2));
  const tiffVersion = reader.readUInt16();
  assert.equal(tiffVersion, 42, 'Invalid TIFF version number');
  const firstIFDPointer = reader.readUInt32();

  const readIFD = (reader: BufferReader, pointer: number): Tag[] => {
    const numberOfTags = reader.move(pointer).readUInt16();

    return new Array(numberOfTags).fill(null).map((_, index) => {
      const parsedTag = parseTagFromBuffer(reader, reader.pos() + index * 12);

      if ([0x8769, 0x8825, 0xA005].includes(parsedTag.tagId)) {
        return new Tag({
          ...parsedTag,
          value: new TagManager(readIFD(reader.clone(), (parsedTag.rawValue as any)[0])),
        });
      }

      return parsedTag;
    });
  };

  return new TagManager(readIFD(reader.clone(), firstIFDPointer));
}

/**
 *
 * @param {Buffer} input
 * @returns {boolean}
 */
function isBigEnd(input: Buffer): boolean {
  switch (0) {
    case input.compare(TIFF_FLAG_BIG_END):
      return true;
    case input.compare(TIFF_FLAG_LITTLE_END):
      return false;
    default:
      throw new Error('invalid TIFF data');
  }
}

/**
 *
 * @param {BufferReader} reader
 * @param {number} offset
 * @returns {Tag}
 */
export function parseTagFromBuffer(
  reader: BufferReader,
  offset: number,
): Tag {
  const myReader = reader.clone().move(offset);
  const tagId = myReader.readUInt16();
  const type = myReader.readUInt16();
  const numValues = myReader.readUInt32();
  const valueOffset = myReader.readUInt32();
  const value = getTagCoder(type).decode(myReader, numValues, valueOffset, myReader.bigEnd);

  return new Tag({
    tagId,
    type,
    value,
  });
}
