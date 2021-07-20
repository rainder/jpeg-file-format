import { expect } from 'chai';
import * as fs from 'fs';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';
import JPEGFileFormat from './index';

describe('jpeg file format', () => {
  const filePath = (name: string) => path.resolve(pkgDir.sync(__dirname) as string, 'samples', name);
  const loadImage = async (name: string) => readFileSync(filePath(name));

  it('should load JPEG', async () => {
    const image = await loadImage('image2.jpg');
    const jpeg = JPEGFileFormat.load(image);

    // const a = image.toString('hex').toUpperCase();
    // const b = jpeg.toBuffer().toString('hex').toUpperCase();
    //
    // for (let i = 0; i < a.length; i += 2) {
    //   if (a.substr(i, 2) !== b.substr(i, 2)) {
    //     console.log('incompatibility at', i / 2);
    //     console.log(a.substr(i));
    //     console.log(b.substr(i));
    //     break;
    //   }
    // }

    console.log(jpeg.findSegment(0xE1)?.setUserComment('helooooooooooooooooooo'));


    writeFileSync(filePath('output.jpg'), jpeg.toBuffer());
    // jpeg.toBuffer();
    // expect(jpeg.toBuffer().compare(image)).to.equals(0);
  });

  it('should read image without exif tags', async () => {
    const jpeg = JPEGFileFormat.load(await loadImage('no-exif.jpg'));
    const exifSegment = jpeg.findOrCreateExifSegment();

    exifSegment.setUserComment('test');

    // await fs.writeFileSync(filePath('no-exif-out.jpg'), jpeg.toBuffer());
  });

  // it('should load jpeg3', async () => {
  //   const image = await loadImage('image3.jpeg');
  //   const jpeg = JPEGFileFormat.load(image);
  //
  //   console.log(jpeg.findSegment(0xE1)?.setUserComment('helooooooooooooooooooo'));
  //
  //   writeFileSync(filePath('output.jpg'), jpeg.toBuffer());
  // });
});
