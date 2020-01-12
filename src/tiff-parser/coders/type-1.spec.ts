import { expect } from 'chai';
import { stringToReader, trimHexInput } from '../../utils/test-helpers';
import { parseTagFromBuffer } from '../tiff-to-tags';
import { tag1Coder } from './type-1';

describe('coder : type-1', () => {

  describe('decode', () => {
    it('should decode number length 1', async () => {
      const reader = stringToReader('AAAA0001 00000001 05030201');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 1,
        rawValue: [5],
      });
    });
    it('should decode number length 2', async () => {
      const reader = stringToReader('AAAA0001 00000002 05030201');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 1,
        rawValue: [5, 3],
      });
    });
    it('should decode number length 3', async () => {
      const reader = stringToReader('AAAA0001 00000003 05030201');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 1,
        rawValue: [5, 3, 2],
      });
    });
    it('should decode number length 4', async () => {
      const reader = stringToReader('AAAA0001 00000004 05030201');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 1,
        rawValue: [5, 3, 2, 1],
      });
    });
    it('should decode number length 5', async () => {
      const reader = stringToReader('AAAA0001 00000005 0000000C 01020304 05');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 1,
        rawValue: [1, 2, 3, 4, 5],
      });
    });
    it('should decode number length 8', async () => {
      const reader = stringToReader('AAAA0001 00000008 0000000C 01020304 05060708');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 1,
        rawValue: [1, 2, 3, 4, 5, 6, 7, 8],
      });
    });
  });
  describe('encode', () => {
    it('should encode length 1', async () => {
      const tt2 = tag1Coder;
      const encode = tt2.encode(270, [1], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0001 00000001 01000000'));
    });
    it('should encode length 2', async () => {
      const tt2 = tag1Coder;
      const encode = tt2.encode(270, [1, 2], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0001 00000002 01020000'));
    });
    it('should encode length 4', async () => {
      const tt2 = tag1Coder;
      const encode = tt2.encode(270, [1, 2, 3, 4], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0001 00000004 01020304'));
    });
  });
});
