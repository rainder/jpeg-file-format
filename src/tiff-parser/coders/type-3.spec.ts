import { expect } from 'chai';
import { stringToReader, trimHexInput } from '../../utils/test-helpers';
import { parseTagFromBuffer } from '../tiff-to-tags';
import { tag3Coder } from './type-3';

describe('coder : type-3', () => {

  describe('decode', () => {
    it('should decode length 1 big', async () => {
      const reader = stringToReader('AAAA0003 00000001 00010002');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 3,
        rawValue: [1],
      });
    });
    it('should decode length 2 big', async () => {
      const reader = stringToReader('AAAA0003 00000002 00010002');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 3,
        rawValue: [1, 2],
      });
    });
    it('should decode length 2 little', async () => {
      const reader = stringToReader('AAAA0300 02000000 01000200');
      reader.bigEnd = false;

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 3,
        rawValue: [1, 2],
      });
    });
    it('should decode length 8 big', async () => {
      const reader = stringToReader('AAAA0003 00000004 0000000c 00010002 00030004');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 3,
        rawValue: [1, 2, 3, 4],
      });
    });

  });
  describe('encode', () => {
    it('should encode length 1', async () => {
      const tt2 = tag3Coder;
      const encode = tt2.encode(270, [1], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0003 00000001 00010000'));
    });
    it('should encode length 2', async () => {
      const tt2 = tag3Coder;
      const encode = tt2.encode(270, [1, 2], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0003 00000002 00010002'));
    });
    it('should encode length 3', async () => {
      const tt2 = tag3Coder;
      const encode = tt2.encode(270, [1, 2, 3], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0003 00000003 00010002 0003'));
    });
  });
});
