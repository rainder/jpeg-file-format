import { createCoder } from './index';

export const tag1Coder = createCoder<number>(
  1,
  1,
  (input) => input.readUInt8(),
  (reader, value: number[]) => {
    value.forEach((value) => {
      reader.writeUInt8(value);
    });

    return reader.buffer;
  },
);
