import { createCoder } from './index';

export const tag7Coder = createCoder<number>(
  1,
  7,
  (input) => input.readUInt8(),
  (reader, value: number[]) => {
    value.forEach((value) => {
      reader.writeUInt8(value);
    });

    return reader.buffer;
  },
);
