import { num2fraction } from '../../utils/num2fraction';
import { createCoder } from './index';

export const tag5Coder = createCoder<number>(
  8,
  5,
  (input, bigEnd) => {
    const numerator = input.readUInt32(bigEnd);
    const denominator = input.readUInt32(bigEnd);
    const result = numerator / denominator;

    return result;
  },
  (reader, value: number[], bigEnd) => {
    value.forEach((value) => {
      let { numerator, denominator } = num2fraction(value);

      // - workaround to match external apps
      if (denominator > 5 && 100 % denominator === 0) {
        const multiplier = 100 / denominator;
        numerator *= multiplier;
        denominator *= multiplier;
      }

      reader.writeUInt32(numerator, bigEnd);
      reader.writeUInt32(denominator || 1, bigEnd);
    });

    return reader.buffer;
  },
);
