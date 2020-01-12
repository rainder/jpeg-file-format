import { expect } from 'chai';
import { stringToReader, trimHexInput } from '../../utils/test-helpers';
import { parseTagFromBuffer } from '../tiff-to-tags';
import { tag4Coder } from './type-4';

describe('coder : type-4', () => {
  describe('decode', () => {
    it('should decode length 1', async () => {
      const reader = stringToReader('AAAA0004 00000001 00000001');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 4,
        rawValue: [1],
      });
    });
  });
  describe('encode', () => {
    it('should encode length 1', async () => {
      const tt2 = tag4Coder;
      const encode = tt2.encode(270, [1], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0004 00000001 00000001'));
    });
    it('should encode length 2', async () => {
      const tt2 = tag4Coder;
      const encode = tt2.encode(270, [1, 2], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0004 00000002 00000001 00000002'));
    });
  });
});
