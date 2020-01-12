import { readFileSync } from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';
import { TagManager } from '../tiff-parser/tag-manager';
import ExifSegment from './exif.segment';
import { expect } from 'chai';

describe('exif segment', () => {
  const readSegmentData = () => readFileSync(path.resolve(pkgDir.sync(__dirname) as string, 'samples/exif.segment'));

  it('should parse the exif segment', async () => {
    const segmentData = readSegmentData();
    const exifSegment = new ExifSegment(12, segmentData);

    expect(exifSegment.tagManager).to.be.instanceOf(TagManager);
    expect(exifSegment.tagManager.tags.length).to.deep.equals(10);
  });
});
