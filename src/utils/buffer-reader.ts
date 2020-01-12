export default class BufferReader {
  private pointer = 0;

  constructor(
    public readonly buffer: Buffer,
    public bigEnd: boolean = true,
  ) {
  }

  hasMore() {
    return this.buffer.length > this.pointer;
  }

  readBytes(num: number): Buffer {
    this.pointer += num;

    return this.buffer.slice(this.pointer - num, this.pointer);
  }

  readUInt8(): number {
    this.pointer += 1;

    return this.buffer.readUInt8(this.pointer - 1);
  }

  writeUInt8(value: number): this {
    this.pointer += 1;
    this.buffer.writeUInt8(value, this.pointer - 1);

    return this;
  }

  readUInt16(bigEnd: boolean = this.bigEnd): number {
    this.pointer += 2;

    return bigEnd
      ? this.buffer.readUInt16BE(this.pointer - 2)
      : this.buffer.readUInt16LE(this.pointer - 2);
  }

  writeUInt16(value: number, bigEnd: boolean = this.bigEnd): this {
    this.pointer += 2;

    bigEnd
      ? this.buffer.writeUInt16BE(value, this.pointer - 2)
      : this.buffer.writeUInt16LE(value, this.pointer - 2);

    return this;
  }

  readUInt32(bigEnd: boolean = this.bigEnd): number {
    this.pointer += 4;

    return bigEnd
      ? this.buffer.readUInt32BE(this.pointer - 4)
      : this.buffer.readUInt32LE(this.pointer - 4);
  }

  writeUInt32(value: number, bigEnd: boolean = this.bigEnd): this {
    this.pointer += 4;

    bigEnd
      ? this.buffer.writeUInt32BE(value, this.pointer - 4)
      : this.buffer.writeUInt32LE(value, this.pointer - 4);

    return this;
  }

  readInt32(): number {
    this.pointer += 4;

    return this.bigEnd
      ? this.buffer.readInt32BE(this.pointer - 4)
      : this.buffer.readInt32LE(this.pointer - 4);
  }

  writeInt32(value: number): this {
    this.pointer += 4;

    this.bigEnd
      ? this.buffer.writeInt32BE(value, this.pointer - 4)
      : this.buffer.writeInt32LE(value, this.pointer - 4);

    return this;
  }

  seek(bytes: number) {
    this.pointer += bytes;

    return this;
  }

  move(pos: number) {
    this.pointer = pos;

    return this;
  }

  pos() {
    return this.pointer;
  }

  remaining() {
    const buffer = this.buffer.slice(this.pointer);
    this.seek(buffer.length);

    return buffer;
  }

  source() {
    return this.buffer;
  }

  clone() {
    return new BufferReader(this.buffer, this.bigEnd).move(this.pointer);
  }

}
