ref             = require 'ref'
defaults        = require './defaults'
CleverBuffer    = require './clever-buffer-common'

checkOffset = (offset, ext, length) ->
  if (offset + ext > length)
    throw new RangeError('Index out of range');

class CleverBufferReader extends CleverBuffer

  constructor: (buffer, options={}) ->
    super buffer, options

  legacyReadUInt8: (offset, noAssert) ->
    offset = offset >>> 0
    if !noAssert
      checkOffset offset, 1, @buffer.length
    @buffer[offset]

  legacyReadInt8: (offset, noAssert) ->
    offset = offset >>> 0
    if !noAssert
      checkOffset offset, 1, @buffer.length
    val = @buffer[offset]
    if !(val & 0x80) then val else (0xff - val + 1) * -1

  legacyReadUInt16LE: (offset, noAssert) ->
    offset = offset >>> 0
    if !noAssert
      checkOffset offset, 2, @buffer.length
    @buffer[offset] | @buffer[offset + 1] << 8

  legacyReadUInt16BE: (offset, noAssert) ->
    offset = offset >>> 0
    if !noAssert
      checkOffset offset, 2, @buffer.length
    @buffer[offset] << 8 | @buffer[offset + 1]

  legacyReadInt16LE: (offset, noAssert) ->
    offset = offset >>> 0
    if !noAssert
      checkOffset offset, 2, @buffer.length
    val = @buffer[offset] | @buffer[offset + 1] << 8
    if val & 0x8000 then val | 0xFFFF0000 else val

  legacyReadInt16BE: (offset, noAssert) ->
    offset = offset >>> 0
    if (!noAssert)
      checkOffset(offset, 2, @buffer.length)
    val = @buffer[offset + 1] | @buffer[offset] << 8
    if val & 0x8000 then val | 0xFFFF0000 else val

  legacyReadUInt32LE: (offset, noAssert) ->
    offset = offset >>> 0
    if (!noAssert)
      checkOffset(offset, 4, @buffer.length);
    (@buffer[offset] | @buffer[offset + 1] << 8 | @buffer[offset + 2] << 16) + @buffer[offset + 3] * 0x1000000

  legacyReadUInt32BE: (offset, noAssert) ->
    offset = offset >>> 0
    if (!noAssert)
      checkOffset(offset, 4, @buffer.length)
    @buffer[offset] * 0x1000000 + (@buffer[offset + 1] << 16 | @buffer[offset + 2] << 8 | @buffer[offset + 3])

  legacyReadInt32LE: (offset, noAssert) ->
    offset = offset >>> 0
    if (!noAssert)
      checkOffset(offset, 4, @buffer.length)
    @buffer[offset] | @buffer[offset + 1] << 8 | @buffer[offset + 2] << 16 | @buffer[offset + 3] << 24

  legacyReadInt32BE: (offset, noAssert) ->
    offset = offset >>> 0
    if (!noAssert)
      checkOffset(offset, 4, @buffer.length)
    @buffer[offset] << 24 | @buffer[offset + 1] << 16 | @buffer[offset + 2] << 8 | @buffer[offset + 3]

  getUInt8: (_offset) =>
    @legacyReadUInt8 _offset ? @offset++, @noAssert

  getInt8: (_offset) =>
    @legacyReadInt8 _offset ? @offset++, @noAssert

  getUInt16: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @legacyReadUInt16BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyReadUInt16LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  getInt16: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @legacyReadInt16BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyReadInt16LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  getUInt32: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @legacyReadUInt32BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyReadUInt32LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  getInt32: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @legacyReadInt32BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyReadInt32LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  getUInt64: (_offset) =>
    offset = _offset ? @offset
    if not @noAssert and @buffer.length - offset < 8
      throw new RangeError 'Index out of range'
    if @bigEndian
      val = ref.readUInt64BE(@buffer, offset)
    else
      val = ref.readUInt64LE(@buffer, offset)
    @offset += 8 if _offset is undefined
    val.toString()

  getInt64: (_offset) =>
    offset = _offset ? @offset
    if not @noAssert and @buffer.length - offset < 8
      throw new RangeError 'Index out of range'
    if @bigEndian
      val = ref.readInt64BE(@buffer, offset)
    else
      val = ref.readInt64LE(@buffer, offset)
    @offset += 8 if _offset is undefined
    val.toString()

  getString: (options={}) =>
    offsetSpecified = options.offset?
    { length, offset, encoding } = defaults options,
      length: 0
      offset: @offset
      encoding: 'utf-8'
    return '' if length is 0
    val = @buffer.toString encoding, offset, offset + length
    @offset += length if not offsetSpecified
    val

  getBytes: (options={}) =>
    offsetSpecified = options.offset?
    { length, offset } = defaults options,
      length: 0
      offset: @offset
    return [] if length is 0
    val = Array.prototype.slice.call(@buffer, offset, offset + length)
    @offset += length if not offsetSpecified
    val

module.exports = CleverBufferReader
