export function numberToBuffer(size: number, value: number, bigEnd: boolean): Buffer {
  const buffer = Buffer.alloc(size);

  switch (size) {
    case 1:
      buffer.writeUInt8(value, 0);
      break;
    case 2:
      bigEnd
        ? buffer.writeUInt16BE(value, 0)
        : buffer.writeUInt16LE(value, 0);
      break;
    default:
      throw new Error(`unsupported buffer size: ${ size }`);
  }

  return buffer;
}
