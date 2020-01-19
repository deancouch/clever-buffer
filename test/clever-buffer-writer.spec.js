/* eslint-disable no-shadow */
require('should');
const _ = require('lodash');

const CleverBufferWriter = require(`${SRC}/clever-buffer-writer`);
const {
  writeToStupidBuffer,
  writeToCleverBuffer,
} = require('./support/test-helper');
const specHelper = require('./spec-helper');

describe('CleverBufferWriter', () => {
  const powed = (v) => 2 ** v - 1;

  // generates a unsigned range, e.g [0, 1, 3, 7, 15, 31, 63, 127, 255]
  const unsignedValues = (count) => _.map(_.range(0, count + 1, 1), powed);

  // generates a signed range, e.g [-127, -63, -31, -15, -7, -3, -1, 0, 1, 3, 7, 15, 31, 63, 127]
  const signedValues = (count) => {
    const values = _.map(_.range(0, count, 1), powed);
    // flip the signs, reverse it, remove the extra '0', and concat the orig values
    return _.concat(_.map(values, (v) => v * -1).reverse().slice(0, -1), values);
  };

  it('should write Uint8', () => {
    const numberOfBytesPerWord = 1;
    const values = unsignedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt8(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt8(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write int8', () => {
    const numberOfBytesPerWord = 1;
    const values = signedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt8(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeInt8(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write Uint16 Little Endian', () => {
    const numberOfBytesPerWord = 2;
    const values = unsignedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt16LE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt16(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write int16 Little Endian', () => {
    const numberOfBytesPerWord = 2;
    const values = signedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt16LE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeInt16(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write Uint16 Big Endian', () => {
    const numberOfBytesPerWord = 2;
    const values = unsignedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt16BE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt16(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write int16 Big Endian', () => {
    const numberOfBytesPerWord = 2;
    const values = signedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt16BE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeInt16(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write Uint32 Little Endian', () => {
    const numberOfBytesPerWord = 4;
    const values = unsignedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt32LE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt32(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write int32 Little Endian', () => {
    const numberOfBytesPerWord = 4;
    const values = signedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt32LE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeInt32(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write Uint32 Big Endian', () => {
    const numberOfBytesPerWord = 4;
    const values = unsignedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt32BE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt32(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write int32 Big Endian', () => {
    const numberOfBytesPerWord = 4;
    const values = signedValues(8 * numberOfBytesPerWord);
    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt32BE(value, offset, true));
    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeInt32(value));

    buf.should.eql(cleverBuffer);
  });

  it('should write bytes', () => {
    const buf = Buffer.alloc(11);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeBytes([0x20, 0x6d, 0x65, 0x20, 0x57, 0x6f, 0x72, 0x72, 0x79, 0x21]);
    cleverBufferWriter.writeBytes([0x20]);
    cleverBufferWriter.writeBytes([0x57, 0x68, 0x61, 0x74], { offset: 2 });

    cleverBufferWriter.getBuffer().should.eql(Buffer.from([0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]));
  });

  it('should skip bytes', () => {
    const buf = Buffer.alloc(4);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt8(0x10);
    cleverBufferWriter.skip(2);
    cleverBufferWriter.writeUInt8(0x20);

    cleverBufferWriter.getBuffer().should.eql(Buffer.from([0x10, 0x00, 0x00, 0x20]));
  });

  it('should skip to set offset', () => {
    const buf = Buffer.alloc(4);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt8(0x10);
    cleverBufferWriter.skipTo(2);
    cleverBufferWriter.writeUInt8(0x20);

    cleverBufferWriter.getBuffer().should.eql(Buffer.from([0x10, 0x00, 0x20, 0x00]));
  });

  it('should write string', () => {
    const buf = Buffer.alloc(32);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    let len = cleverBufferWriter.writeString('EXPECTED RETURN!');
    len += cleverBufferWriter.writeString('RETURN OF $2.00!');
    len.should.eql(32);
    cleverBufferWriter.getOffset().should.eql(32);
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x45, 0x58, 0x50, 0x45, 0x43, 0x54, 0x45, 0x44, 0x20, 0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x21,
      0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x20, 0x4f, 0x46, 0x20, 0x24, 0x32, 0x2e, 0x30, 0x30, 0x21,
    ]));
  });

  it('should write string in multi-byte encodings', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('héllo', { encoding: 'utf-8' });
    len.should.eql(6);
    cleverBufferWriter.getOffset().should.eql(6);
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x68, 0xc3, 0xa9, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00, 0x00,
    ]));
  });

  // because of buffer.write(value, offset, length, encoding)
  it('takes the encoding param into account, even if length is not specified', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('héllo', { encoding: 'utf16le' });
    len.should.eql(10);
  });

  it('should write partial strings using length (number of bytes)', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('HELLOWORLD', { length: 5 });
    // Only writes hello
    len.should.eql(5);
    cleverBufferWriter.getOffset().should.eql(5);
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x48, 0x45, 0x4C, 0x4C, 0x4F, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]));
  });

  it('should write partial multi-byte strings using length (number of bytes)', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('héllo', { length: 4 });
    // Only writes hél
    len.should.eql(4);
    cleverBufferWriter.getOffset().should.eql(4);
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x68, 0xc3, 0xa9, 0x6c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]));
  });

  it('does not write partially encoded characters', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('éè', { length: 3 });
    // Only writes é
    len.should.eql(2);
    cleverBufferWriter.getOffset().should.eql(2);
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0xc3, 0xa9, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]));
  });

  it('should write string at a specified offset', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeString('HELLO', { offset: 5 });

    // Writes hello starting at offset 5
    cleverBufferWriter.getOffset().should.eql(0);
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F,
    ]));
  });

  it('should be able to writeUInt8 at a specific offset', () => {
    const buf = Buffer.alloc(5);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt8(1);
    cleverBufferWriter.writeUInt8(2);
    cleverBufferWriter.writeUInt8(3);
    cleverBufferWriter.writeUInt8(4);
    cleverBufferWriter.writeUInt8(5);
    cleverBufferWriter.writeUInt8(6, 1);

    // Writes 6 at position 1
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x01, 0x06, 0x03, 0x04, 0x05,
    ]));
    // Does not increment the offset
    cleverBufferWriter.getOffset().should.eql(5);
  });

  it('should be able to writeUInt16 at a specific offset', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt16(1);
    cleverBufferWriter.writeUInt16(2);
    cleverBufferWriter.writeUInt16(3);
    cleverBufferWriter.writeUInt16(4);
    cleverBufferWriter.writeUInt16(5);
    cleverBufferWriter.writeUInt16(6, 2);

    // Writes 6 at position 2
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x01, 0x00, 0x06, 0x00, 0x03, 0x00, 0x04, 0x00, 0x05, 0x00,
    ]));
    // Does not increment the offset
    cleverBufferWriter.getOffset().should.eql(10);
  });

  it('should write Uint64 little endian MAX when passed a "string"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64('18446744073709551615');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write Uint64 little endian MAX when passed a "bigint"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64(18446744073709551615n);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write Uint64 big endian MAX when passed a "string"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeUInt64('18446744073709551615');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write Uint64 big endian MAX when passed a "bigint"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeUInt64(18446744073709551615n);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write Uint64 little endian when passed a "string"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64('4294967366');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    ]));
  });

  it('should write Uint64 little endian ignoring leading zeros', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: false });
    cleverBuffer.writeUInt64('00004294967366');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    ]));
  });

  it('should write Uint64 little endian when passed a "bigint"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64(4294967366n);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    ]));
  });

  it('should write Uint64 little endian when passed a "number"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64(4294967366);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    ]));
  });

  it('should write Uint64 big endian when passed a "string"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeUInt64('4294967366');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46,
    ]));
  });

  it('should write Uint64 big endian ignoring leading zeros', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeUInt64('00004294967366');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46,
    ]));
  });

  it('should write Uint64 big endian when passed a "bigint"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeUInt64(4294967366n);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46,
    ]));
  });

  it('should write Uint64 big endian when passed a "number"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeUInt64(4294967366);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46,
    ]));
  });

  it('should write int64 little endian when passed a "string"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeInt64('-1');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write int64 little endian when passed a "bigint"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeInt64(-1n);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write int64 little endian when passed a "number"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeInt64(-1);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write int64 big endian when passed a "string"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeInt64('-1');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write int64 big endian when passed a "bigint"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeInt64(-1n);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write int64 big endian when passed a "number"', () => {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, { bigEndian: true });
    cleverBuffer.writeInt64(-1);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
  });

  it('should write Uint64 at specified offset, currentOffset should not increment', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64('18446744073709551615', 2);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    ]));
    cleverBuffer.getOffset().should.eql(0);
  });

  it('should write Uint64 at current offset, currentOffset should increment', () => {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.skip(1);
    cleverBuffer.writeUInt64('18446744073709551615');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
    ]));
    cleverBuffer.getOffset().should.eql(9);
  });

  it('throws an exception when writing past the length', () => {
    const buf = Buffer.from([0x1]);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt8(1);
    ((() => cleverBuffer.writeUInt8(1))).should.throw();
  });

  describe('leading zeros are handling correctly', () => specHelper.cartesianProduct({
    size: [1, 2, 4, 8],
    unsigned: [false, true],
    bigEndian: [false, true],
  }).map((testCase) => (({ size, unsigned, bigEndian }) => it(`should correctly handle leading zero for ${JSON.stringify(testCase)}`, () => {
    let f;
    const buf1 = Buffer.alloc(size);
    const buf2 = Buffer.alloc(size);

    const cleverBuffer1 = new CleverBufferWriter(buf1, { bigEndian });
    const cleverBuffer2 = new CleverBufferWriter(buf2, { bigEndian });

    if (unsigned) {
      f = `writeUInt${size * 8}`;
      cleverBuffer1[f]('123');
      cleverBuffer2[f]('00123');
    } else {
      f = `writeInt${size * 8}`;
      cleverBuffer1[f]('-123');
      cleverBuffer2[f]('-00123');
    }

    buf1.should.eql(buf2);
  }))));

  describe('check we handle numbers and strings identically', () => specHelper.cartesianProduct({
    size: [1, 2, 4, 8],
    unsigned: [false, true],
    bigEndian: [false, true],
  }).map((testCase) => (({ size, unsigned, bigEndian }) => it(`should correctly handle numbers and strings for ${JSON.stringify(testCase)}`, () => {
    let f;
    const buf1 = Buffer.alloc(size);
    const buf2 = Buffer.alloc(size);

    const cleverBuffer1 = new CleverBufferWriter(buf1, { bigEndian });
    const cleverBuffer2 = new CleverBufferWriter(buf2, { bigEndian });

    if (unsigned) {
      f = `writeUInt${size * 8}`;
      cleverBuffer1[f]('123');
      cleverBuffer2[f](123);
    } else {
      f = `writeInt${size * 8}`;
      cleverBuffer1[f]('-123');
      cleverBuffer2[f](-123);
    }

    buf1.should.eql(buf2);
  }))));

  describe('check only throwing exception for writing negative unsigned integers', () => specHelper.cartesianProduct({
    size: [1, 2, 4, 8],
    bigEndian: [false, true],
  }).map((testCase) => ({ size, bigEndian }) => {
    it(`should throw for ${JSON.stringify(testCase)}`, () => {
      let error;
      const cleverBuffer = new CleverBufferWriter((Buffer.alloc(size)), { bigEndian });

      try {
        cleverBuffer[`writeUInt${size * 8}`]('-1');
      } catch (error1) {
        error = error1;
        error.toString().should.match(/TypeError|RangeError/);
      }
      try {
        cleverBuffer[`writeUInt${size * 8}`](-1);
      } catch (error2) {
        error = error2;
        error.toString().should.match(/TypeError|RangeError/);
      }
    });
  }));
});
