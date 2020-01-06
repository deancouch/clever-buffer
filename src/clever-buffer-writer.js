const ref             = require('ref-napi');

const defaults        = require('./defaults');
const CleverBuffer    = require('./clever-buffer-common');

const checkInt = (buffer, value, offset, ext, max, min) => {
  if ((value > max) || (value < min)) {
    throw new TypeError('"value" argument is out of bounds');
  }
  if ((offset + ext) > buffer.length) {
    throw new RangeError('Index out of range');
  }
};

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
    // ref treats leading zeros as denoting octal numbers, so we want to strip
    // them out to prevent this behaviour
    if (typeof value === 'number' || typeof value === 'bigint') {
      value = value.toString();
    }
    // console.log(`hello: ${value}`);
    if (!/^\d+$/.test(value)) {
      throw new RangeError('"value" argument is out of bounds');
    }
    value = value.replace(/^0+(\d)/, '$1');
    if (this.bigEndian) {
      ref.writeUInt64BE(this.buffer, offset, value);
    } else {
      ref.writeUInt64LE(this.buffer, offset, value);
    }
    if (_offset === undefined) { return this.offset += 8; }
  }

  writeInt64(value, _offset) {
    const offset = _offset != null ? _offset : this.offset;
    if (typeof value === 'number' || typeof value === 'bigint') {
      value = value.toString();
    }
    if (!/^-?\d+$/.test(value)) {
      throw new RangeError('"value" argument is out of bounds');
    }
    // ref treats leading zeros as denoting octal numbers, so we want to strip
    // them out to prevent this behaviour.
    // Also, ref treats '-0123' as a negative octal
    value = value.replace(/^(-?)0+(\d)/, '$1$2');
    if (this.bigEndian) {
      ref.writeInt64BE(this.buffer, offset, value);
    } else {
      ref.writeInt64LE(this.buffer, offset, value);
    }
    if (_offset === undefined) { return this.offset += 8; }
  }

  writeString(value, options = {}) {
    const offsetSpecified = (options.offset != null);
    let { length, offset, encoding } = defaults(options, {
      length: null,
      offset: this.offset,
      encoding: 'utf-8'
    }
    );
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
