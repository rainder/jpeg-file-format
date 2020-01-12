import { expect } from 'chai';
import { stringToReader, trimHexInput } from '../../utils/test-helpers';
import { parseTagFromBuffer } from '../tiff-to-tags';
import { tag2Coder } from './type-2';

describe('coder : type-2', () => {

  describe('decode', () => {
    it('should decode length 1', async () => {
      const reader = stringToReader('AAAA0002 00000001 61626364');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 2,
        rawValue: ['a'],
      });
    });
    it('should decode length 2', async () => {
      const reader = stringToReader('AAAA0002 00000002 61626364');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 2,
        rawValue: ['a', 'b'],
      });
    });
    it('should decode length 3', async () => {
      const reader = stringToReader('AAAA0002 00000003 61626364');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 2,
        rawValue: ['a', 'b', 'c'],
      });
    });
    it('should decode length 4', async () => {
      const reader = stringToReader('AAAA0002 00000004 61626364');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 2,
        rawValue: ['a', 'b', 'c', 'd'],
      });
    });
    it('should decode length 5', async () => {
      const reader = stringToReader('AAAA0002 00000005 0000000C 61626364 65');

      expect(parseTagFromBuffer(reader, 0)).to.deep.equals({
        tagId: 43690,
        type: 2,
        rawValue: ['a', 'b', 'c', 'd', 'e'],
      });
    });
  });
  describe('encode', () => {
    it('should encode length 1', async () => {
      const tt2 = tag2Coder;
      const encode = tt2.encode(270, ['a'], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0002 00000001 61000000'));
    });
    it('should encode length 2', async () => {
      const tt2 = tag2Coder;
      const encode = tt2.encode(270, ['ab'], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0002 00000002 61620000'));
    });
    it('should encode length 4', async () => {
      const tt2 = tag2Coder;
      const encode = tt2.encode(270, ['abcd'], true);

      expect(encode.toString('hex')).to.equals(trimHexInput('010e 0002 00000004 61626364'));
    });
  });
});
