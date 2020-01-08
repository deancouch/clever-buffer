const defaults        = require('./defaults');
const CleverBuffer    = require('./clever-buffer-common');

class CleverBufferWriter extends CleverBuffer {

  constructor(buffer, options = {}) {
    super(buffer, options);
  }

  writeUInt8(value, _offset) {
    return this.buffer.writeUInt8(value, _offset != null ? _offset : this.offset++);
  }

  writeInt8(value, _offset) {
    return this.buffer.writeInt8(value, _offset != null ? _offset : this.offset++);
  }

  writeUInt16(value, _offset) {
    const bigFunction = (offset) => {
      return this.buffer.writeUInt16BE(value, offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.writeUInt16LE(value, offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  writeInt16(value, _offset) {
    const bigFunction = (offset) => {
      return this.buffer.writeInt16BE(value, offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.writeInt16LE(value, offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  writeUInt32(value, _offset) {
    const bigFunction = (offset) => {
      return this.buffer.writeUInt32BE(value, offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.writeUInt32LE(value, offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  writeInt32(value, _offset) {
    const bigFunction = (offset) => {
      return this.buffer.writeInt32BE(value, offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.writeInt32LE(value, offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  writeUInt64(value, _offset) {
    const offset = _offset != null ? _offset : this.offset;
    if (typeof value !== 'bigint') {
      value = BigInt(value);
    }
    if (this.bigEndian) {
      this.buffer.writeBigUInt64BE(value, offset);
    } else {
      this.buffer.writeBigUInt64LE(value, offset);
    }
    if (_offset === undefined) { return this.offset += 8; }
  }

  writeInt64(value, _offset) {
    const offset = _offset != null ? _offset : this.offset;
    if (typeof value !== 'bigint') {
      value = BigInt(value);
    }
    if (this.bigEndian) {
      this.buffer.writeBigInt64BE(value, offset);
    } else {
      this.buffer.writeBigInt64LE(value, offset);
    }
    if (_offset === undefined) { return this.offset += 8; }
  }

  writeString(value, options = {}) {
    const offsetSpecified = (options.offset != null);
    let { length, offset, encoding } = defaults(options, {
      length: null,
      offset: this.offset,
      encoding: 'utf-8'
    });
    if (length != null) {
      length = this.buffer.write(value, offset, length, encoding);
    } else {
      length = this.buffer.write(value, offset, encoding);
    }
    if (!offsetSpecified) { this.offset += length; }
    return length;
  }

  writeBytes(value, options = {}) {
    const offsetSpecified = (options.offset != null);
    const offset = options.offset != null ? options.offset : this.offset;
    Buffer.from(value).copy(this.buffer, offset);
    if (!offsetSpecified) { return this.offset += value.length; }
  }
}

module.exports = CleverBufferWriter;
