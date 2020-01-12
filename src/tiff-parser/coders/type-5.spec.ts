import { expect } from 'chai';
import { stringToReader, trimHexInput } from '../../utils/test-helpers';
import { parseTagFromBuffer } from '../tiff-to-tags';
import { tag5Coder } from './type-5';

describe('coder : type-5', () => {

  describe('decode', () => {
    it('should decode length 1', async () => {
      const reader = stringToReader('AAAA0005 00000001 0000000C 00000004 00000002');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 5,
        rawValue: [2],
      });
    });
  });
  describe('encode', () => {
    it('should encode length 1', async () => {
      const tt2 = tag5Coder;
      const encode = tt2.encode(270, [0.5], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0005 00000001 00000001 00000002'));
    });
    it('should encode length 2', async () => {
      const tt2 = tag5Coder;
      const encode = tt2.encode(270, [0.5, 0.25], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0005 00000002 00000001 00000002 00000001 00000004'));
    });
  });
});
