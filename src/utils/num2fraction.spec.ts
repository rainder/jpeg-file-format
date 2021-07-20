import { expect } from 'chai';
import { num2fraction } from './num2fraction';

describe('num2fraction', () => {
  it('should process 4.911586991291985', async () => {
    const input = 4.911586991291985;
    const { numerator, denominator } = num2fraction(input);

    expect(numerator).to.be.lessThanOrEqual(2_147_483_647);
    expect(denominator).to.be.lessThanOrEqual(2_147_483_647);

    const result = numerator / denominator;

    expect(input - result).to.equals(0);
  });
  it('should process 330.7814330779631', async () => {
    const input = 330.7814330779631;
    const { numerator, denominator } = num2fraction(input);

    console.log(numerator, denominator);

    expect(numerator).to.be.lessThanOrEqual(2_147_483_647);
    expect(denominator).to.be.lessThanOrEqual(2_147_483_647);

    const result = numerator / denominator;

    expect(input - result).to.closeTo(0, 0.001);
  });
});
