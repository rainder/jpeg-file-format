import { num2fraction } from '../../utils/num2fraction';
import { createCoder } from './index';

export const tag10Coder = createCoder<number>(
  8,
  10,
  (input) => {
    return input.readInt32() / input.readInt32();
  },
  (reader, value: number[]) => {
    value.forEach((value) => {
      const { numerator, denominator } = num2fraction(value);

      reader.writeInt32(numerator);
      reader.writeInt32(denominator);
    });

    return reader.buffer;
  },
);
