var abs = Math.abs;
var round = Math.round;

function almostEq(a: number, b: number): boolean {
  return abs(a - b) <= 9.5367432e-7;
}

//最大公约数 Greatest Common Divisor
function GCD(a: number, b: number): number {
  if (almostEq(b, 0)) {
    return a;
  }
  return GCD(b, a % b);
}

function findPrecision(n: number): number {
  var e = 1;

  while (!almostEq(round(n * e) / e, n)) {
    e *= 10;
  }

  return e;
}

function trySimple(num: number): {
  numerator: number;
  denominator: number;
} | null {
  for (let i = 1; i < 1e3; i++) {
    if ((num * i) % 1 === 0) {
      return {
        numerator: num * i,
        denominator: i,
      };
    }
  }

  return null;
}

export function num2fraction(num: number | string): {
  numerator: number,
  denominator: number,
} {
  if (num === 0 || num === '0') {
    return {
      numerator: 0,
      denominator: 0,
    };
  }

  if (typeof num === 'string') {
    num = parseFloat(num);
  }

  const simpleAnswer = trySimple(num);

  if (simpleAnswer) {
    return simpleAnswer;
  }

  const precision = findPrecision(num); //精确度
  const number = num * precision;
  const gcd = abs(GCD(number, precision));

  //分子
  const numerator = number / gcd;
  //分母
  const denominator = precision / gcd;

  //分数
  // return round(numerator) + '/' + round(denominator);

  return {
    numerator: round(numerator),
    denominator: round(denominator),
  };
}
