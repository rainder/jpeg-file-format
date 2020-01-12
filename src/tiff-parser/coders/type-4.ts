import { createCoder } from './index';

export const tag4Coder = createCoder<number>(
  4,
  4,
  (input, bigEnd) => input.readUInt32(bigEnd),
  (reader, value: number[], bigEnd) => {
    value.forEach((value) => {
      reader.writeUInt32(value, bigEnd);
    });

    return reader.buffer;
  },
);
