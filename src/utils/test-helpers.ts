import BufferReader from './buffer-reader';

export const trimHexInput = (input: string) => input.replace(/[ \n\t\r]+/g, '');

export const stringToReader = (input: string) => {
  return new BufferReader(stringToBuffer(input));
};

export const stringToBuffer = (input: string) => {
  const data = trimHexInput(input);
  const chunks = new Array(data.length / 2).fill(0).map((_, index) => {
    return Buffer.from(data.substr(index * 2, 2), 'hex');
  });

  return Buffer.concat(chunks);
};
