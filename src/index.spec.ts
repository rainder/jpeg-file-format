import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';
import JPEGFileFormat from './index';
import { expect } from 'chai';
import { trimHexInput } from './utils/test-helpers';

describe('jpeg file format', () => {
  const input = path.resolve(__dirname, '../../../../samples/white.jpg');
  const input2 = path.resolve(__dirname, '../../../../samples/img_1771.jpg');
  const output = path.resolve(__dirname, '../../../../samples/output.jpg');
  const loadImage = async (name: string) => readFileSync(path.resolve(pkgDir.sync(__dirname) as string, 'samples', name));

  it.skip('should load JPEG', async () => {
    const image = await loadImage('image1.jpg');
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

    expect(jpeg.toBuffer().compare(image)).to.equals(0);
  });

});
