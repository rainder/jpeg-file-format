import BufferReader from '../../utils/buffer-reader';

export type Coder<T> = {
  decode: (
    reader: BufferReader,
    numValues: number,
    valueOrOffset: any,
    bigEnd: boolean,
  ) => T[];

  encode: (
    id: number,
    value: T[],
    bigEnd: boolean,
  ) => Buffer;
};

export function createCoder<T>(
  bytesPerValue: number,
  type: number,
  reader: (reader: BufferReader, bigEnd: boolean) => T,
  writer: (reader: BufferReader, value: T[], bigEnd: boolean) => Buffer,
): Coder<T> {
  return {
    encode: createValueWriter<T>(bytesPerValue, type, writer),
    decode: createValueReader<T>(bytesPerValue, reader),
  };
}

/**
 *
 * @param {number} bytesPerValue
 * @param {number} type
 * @param {(reader: BufferReader, value: T[], bigEnd: boolean) => Buffer} writerFunction
 * @returns {(id: number, value: T[], bigEnd: boolean) => Buffer}
 */
export const createValueWriter = <T>(
  bytesPerValue: number,
  type: number,
  writerFunction: (reader: BufferReader, value: T[], bigEnd: boolean) => Buffer,
) => (id: number, value: T[], bigEnd: boolean) => {
  const tagBufferReader = new BufferReader(Buffer.alloc(4));

  tagBufferReader.writeUInt16(id, bigEnd);
  tagBufferReader.writeUInt16(type, bigEnd);

  const reader = new BufferReader(Buffer.alloc(value.length * bytesPerValue));
  const dataBuffer = writerFunction(reader, value, bigEnd);
  const lengthBuffer = new BufferReader(Buffer.alloc(4));

  lengthBuffer.writeUInt32(dataBuffer.length / bytesPerValue);

  return Buffer.concat([
    tagBufferReader.buffer,
    lengthBuffer.buffer,
    dataBuffer,
    Buffer.from(new Array(type === 2 && dataBuffer.length > 4 ? dataBuffer.length % 2 : 0).fill(0)),
    Buffer.alloc(Math.max(0, 4 - dataBuffer.length)),
  ]);
};

/**
 *
 * @param {number} bytesPerValue
 * @param {(reader: BufferReader, bigEnd: boolean) => T} readerFunction
 * @returns {(reader: BufferReader, numValues: number, valueOrOffset: number, bigEnd: boolean) => T[]}
 */
export const createValueReader = <T>(
  bytesPerValue: number,
  readerFunction: (reader: BufferReader, bigEnd: boolean) => T,
) => (
  reader: BufferReader,
  numValues: number,
  valueOrOffset: number,
  bigEnd: boolean,
): T[] => {
  const myReader = reader.clone();
  const bytesToRead = numValues * bytesPerValue;

  if (bytesToRead > 4) {
    myReader.move(valueOrOffset);
  } else {
    myReader.seek(-4);
  }

  const buffer = myReader.readBytes(bytesToRead);

  return new Array(numValues).fill(0).map((_, index) => {
    return readerFunction(new BufferReader(buffer.slice(index * bytesPerValue)), bigEnd);
  });
};
