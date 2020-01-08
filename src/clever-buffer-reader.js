const defaults        = require('./defaults');
const CleverBuffer    = require('./clever-buffer-common');

class CleverBufferReader extends CleverBuffer {

  constructor(buffer, options) {
    super(buffer, options);
    this.getUInt8 = this.getUInt8.bind(this);
    this.getInt8 = this.getInt8.bind(this);
    this.getUInt16 = this.getUInt16.bind(this);
    this.getInt16 = this.getInt16.bind(this);
    this.getUInt32 = this.getUInt32.bind(this);
    this.getInt32 = this.getInt32.bind(this);
    this.getUInt64 = this.getUInt64.bind(this);
    this.getInt64 = this.getInt64.bind(this);
    this.getString = this.getString.bind(this);
    this.getBytes = this.getBytes.bind(this);
    if (options == null) { options = {}; }
  }

  getUInt8(_offset) {
    return this.buffer.readUInt8(_offset != null ? _offset : this.offset++);
  }

  getInt8(_offset) {
    return this.buffer.readInt8(_offset != null ? _offset : this.offset++);
  }

  getUInt16(_offset) {
    const bigFunction = (offset) => {
      return this.buffer.readUInt16BE(offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.readUInt16LE(offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  getInt16(_offset) {
    const bigFunction = (offset) => {
      return this.buffer.readInt16BE(offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.readInt16LE(offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  getUInt32(_offset) {
    const bigFunction = (offset) => {
      return this.buffer.readUInt32BE(offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.readUInt32LE(offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  getInt32(_offset) {
    const bigFunction = (offset) => {
      return this.buffer.readInt32BE(offset);
    };
    const littleFunction = (offset) => {
      return this.buffer.readInt32LE(offset);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  getUInt64(_offset) {
    let val;
    const offset = _offset || this.offset;
    if ((this.buffer.length - offset) < 8) {
      throw new RangeError('Index out of range');
    }
    if (this.bigEndian) {
      val = this.buffer.readBigUInt64BE(offset);
    } else {
      val = this.buffer.readBigUInt64LE(offset);
    }
    if (_offset === undefined) { this.offset += 8; }
    return val.toString();
  }

  getInt64(_offset) {
    let val;
    const offset = _offset || this.offset;
    if ((this.buffer.length - offset) < 8) {
      throw new RangeError('Index out of range');
    }
    if (this.bigEndian) {
      val = this.buffer.readBigInt64BE(offset);
    } else {
      val = this.buffer.readBigInt64LE(offset);
    }
    if (_offset === undefined) { this.offset += 8; }
    return val.toString();
  }

  getString(options = {}) {
    const offsetSpecified = (options.offset != null);
    const { length, offset, encoding } = defaults(options, {
      length: 0,
      offset: this.offset,
      encoding: 'utf-8'
    }
    );
    if (length === 0) { return ''; }
    const val = this.buffer.toString(encoding, offset, offset + length);
    if (!offsetSpecified) { this.offset += length; }
    return val;
  }

  getBytes(options = {}) {
    const offsetSpecified = (options.offset != null);
    const { length, offset } = defaults(options, {
      length: 0,
      offset: this.offset
    }
    );
    if (length === 0) { return []; }
    const val = Array.prototype.slice.call(this.buffer, offset, offset + length);
    if (!offsetSpecified) { this.offset += length; }
    return val;
  }
}

module.exports = CleverBufferReader;
