import { createCoder } from './index';

export const tag3Coder = createCoder<number>(
  2,
  3,
  (input, bigEnd) => input.readUInt16(bigEnd),
  (reader, value: number[], bigEnd) => {
    value.forEach((value) => {
      reader.writeUInt16(value, bigEnd);
    });

    return reader.buffer;
  },
);
