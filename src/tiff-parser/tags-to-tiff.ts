import BufferReader from '../utils/buffer-reader';
import { numberToBuffer } from '../utils/buffer-utils';
import { getTagCoder, TIFF_FLAG_BIG_END, TIFF_FLAG_LITTLE_END, TIFF_FLAG_MARKER } from './index';
import { Tag } from './tag';
import { TagManager } from './tag-manager';

/**
 *
 * @param {Tag[]} tags
 * @param {boolean} bigEnd
 * @returns {Buffer}
 */
export function tagsToTiff(tags: TagManager, bigEnd: boolean): Buffer {
  const initBuffer = Buffer.concat([
    bigEnd ? TIFF_FLAG_BIG_END : TIFF_FLAG_LITTLE_END,
    TIFF_FLAG_MARKER,
    Buffer.from('00000008', 'hex'),
  ]);

  return Buffer.concat([
    initBuffer,
    createIFDBlock(tags, initBuffer.length, bigEnd),
  ]);
}

/**
 *
 * @param {Tag[]} tags
 * @param {number} blockOffset
 * @param {boolean} bigEnd
 * @returns {Buffer}
 */
function createIFDBlock(tags: TagManager, blockOffset: number, bigEnd: boolean): Buffer {
  const counterBuffer = numberToBuffer(2, tags.length, bigEnd);
  const tagsBufferEnding = Buffer.alloc(4);
  const tagsArray: Buffer[] = [];
  const dataArray: Buffer[] = [];
  const extensionsArray: Buffer[] = [];
  const initialOffset = blockOffset + counterBuffer.length;
  const dataBlockOffset = initialOffset + tags.length * 12 + tagsBufferEnding.length;

  const getArraySize = (array: Buffer[]) => array.reduce((result, item) => result + item.length, 0);
  const getDataOffset = () => new BufferReader(Buffer.alloc(4), bigEnd)
    .writeUInt32(dataBlockOffset + getArraySize(dataArray))
    .buffer;

  for (const tag of tags) {
    // if ([0x8769, 0x8825, 0xA005].includes(tag.tagId)) {
    if (tag.rawValue instanceof TagManager) {
      const extensionOffset = dataBlockOffset + getArraySize(dataArray) + getArraySize(extensionsArray);
      const extension = createIFDBlock(tag.rawValue, extensionOffset, bigEnd);
      const encoded = getTagCoder(tag.type).encode(tag.tagId, [extensionOffset], bigEnd);
      tagsArray.push(encoded);
      extensionsArray.push(extension);

      continue;
    }

    const encoded = getTagCoder(tag.type).encode(tag.tagId, tag.rawValue, bigEnd);

    if (encoded.length > 12) {
      tagsArray.push(Buffer.concat([
        encoded.slice(0, 8),
        getDataOffset(),
      ]));
      dataArray.push(encoded.slice(8));
    } else {
      tagsArray.push(encoded);
    }
  }

  return Buffer.concat([
    counterBuffer,
    ...tagsArray,
    tagsBufferEnding,
    ...dataArray,
    ...extensionsArray,
  ]);
}
