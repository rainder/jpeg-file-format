import { createCoder } from './index';

export const tag2Coder = createCoder<string>(
  1,
  2,
  (input) => input.buffer.slice(0, 1).toString(),
  (reader, value: string[]) => {
    const buffer = Buffer.from(value.join(''));

    return Buffer.concat([
      buffer,
    ]);
  },
);
