/* eslint-disable no-plusplus */
/* eslint-disable no-console */
require('should');
const _ = require('lodash');
const assert = require('assert');
const Table = require('cli-table');

const CleverBufferReader = require(`${SRC}/clever-buffer-reader`);

const readUnit8 = () => {
  const buf = Buffer.from([0x52, 0x45, 0x54, 0x55, 0x52, 0x4e, 0x20, 0x4f, 0x46]);
  const cleverBuffer = new CleverBufferReader(buf);
  _.range(0, (buf.length - 1), true).map((i) => assert.equal(cleverBuffer.getUInt8(), buf.readUInt8(i)));
};

const readUInt64 = () => {
  const buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
  const cleverBuffer = new CleverBufferReader(buf);
  assert.equal(cleverBuffer.getUInt64(), '18446744073709551615');
};

const readString = () => {
  const buf = Buffer.from([0x48, 0x45, 0x4C, 0x4C, 0x4F]);
  const cleverBuffer = new CleverBufferReader(buf);
  assert.equal(cleverBuffer.getString({ length: 5 }), 'HELLO');
};

describe('Performance', () => {
  const table = new Table({
    head: ['Operation', 'time (ms)'],
    colWidths: [30, 20],
  });

  const run = (name, op, count) => {
    const start = new Date();
    for (let n = 0, end1 = count, asc = end1 >= 0; asc ? n <= end1 : n >= end1; asc ? n++ : n--) { op(); }
    const end = new Date();
    return table.push([`${name} * ${count}`, end - start]);
  };

  it('prints some performance figures', () => {
    run('Read UInt8', readUnit8, 50000);
    run('Read UInt64', readUInt64, 50000);
    run('Read String', readString, 50000);
    console.log('');
    console.log(table.toString());
  });
});
