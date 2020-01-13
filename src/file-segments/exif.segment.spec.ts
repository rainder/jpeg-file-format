import { expect } from 'chai';
import { readFileSync } from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';
import { TagManager } from '../tiff-parser/tag-manager';
import { stringToBuffer, trimHexInput } from '../utils/test-helpers';
import ExifSegment from './exif.segment';

describe('exif segment', () => {
  const readSegmentData = () => readFileSync(path.resolve(pkgDir.sync(__dirname) as string, 'samples/exif.segment'));

  it('should parse the exif segment', async () => {
    const segmentData = readSegmentData();
    const exifSegment = new ExifSegment(12, segmentData);

    expect(exifSegment.tagManager).to.be.instanceOf(TagManager);
    expect(exifSegment.tagManager.tags.length).to.deep.equals(10);
  });

  it('should get null as user comment', async () => {
    const segmentData = readSegmentData();
    const exifSegment = new ExifSegment(12, segmentData);

    expect(exifSegment.getUserComment()).to.equals(0);
  });

  it('should get user comment', async () => {
    const start = `
      45786966 00004D4D 002A0000 0008
      0001 
      8769 0004 00000001 0000001A
      0000 0000
      0001
      9286 0007 0000000D 0000002C
      0000 0000
    `;
    const input = stringToBuffer(`
      ${ start }
      4153434949000000 6162636465
    `);

    const exifSegment = new ExifSegment(12, input);

    expect(exifSegment.getUserComment()).to.equals('abcde');

    exifSegment.setUserComment('fghij');

    expect(exifSegment.toBuffer().slice(4).toString('hex').toUpperCase()).to.equals(trimHexInput(`
      ${ start }
      4153434949000000 666768696A
    `));
  });
});
