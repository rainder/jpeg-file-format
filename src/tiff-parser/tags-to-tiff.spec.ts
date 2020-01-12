import { expect } from 'chai';
import { trimHexInput } from '../utils/test-helpers';
import { Tag } from './tag';
import { TagManager } from './tag-manager';
import { tagsToTiff } from './tags-to-tiff';

describe('tags-to-tiff', () => {
  it('should encode one string tag', async () => {
    const tiff = tagsToTiff(new TagManager([
      new Tag({
        tagId: 270,
        type: 2,
        value: 'ab'.split('0'),
      }),
    ]), true);

    console.log(tiff);
  });
  it('should encode one long string tag', async () => {
    const tiff = tagsToTiff(new TagManager([
      new Tag({
        tagId: 270,
        type: 2,
        value: 'abcde'.split(''),
      }),
    ]), true);

    console.log(tiff);
  });
  it('should encode two long string tags', async () => {
    const tiff = tagsToTiff(new TagManager([
      new Tag({
        tagId: 270,
        type: 2,
        value: 'abcde'.split(''),
      }),
      new Tag({
        tagId: 271,
        type: 2,
        value: 'fghij'.split(''),
      }),
    ]), true);

    expect(tiff.toString('hex')).to.equals(trimHexInput(`
      4D4D 002A 00000008 0002
      010E 0002 00000005 00000026 
      010F 0002 00000005 0000002c 
      00000000
      616263646500 
      666768696A00
    `).toLowerCase());
  });
  it('should encode ExifIFDPointer tag', async () => {
    const tiff = tagsToTiff(new TagManager([
      new Tag({
        tagId: 274,
        type: 3,
        value: [1],
      }),
      new Tag({
        tagId: 34665,
        type: 4,
        value: new TagManager([
          new Tag({
            tagId: 37510,
            type: 7,
            value: [63, 64, 0],
          }),
        ]),
      }),
    ]), true);


    expect(tiff.toString('hex')).to.equals(trimHexInput(`
      4D4D 002A 00000008 0002
      0112 0003 00000001 00010000 
      8769 0004 00000001 00000026
      00000000
      0001 
      9286 0007 00000003 3f400000
      00000000
    `).toLowerCase());
  });
});
