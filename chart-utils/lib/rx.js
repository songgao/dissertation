'use strict'

const _ = require('underscore');

// before 3af3ccc22a330be824e62a9fe17e7a3d903c157c
// const re = /^recv at ([^\s]+) msg_counter=(\d+) from ([^\s]+) in WSM 1\/1 with (\d+) bytes payload from MAC frame of (\d+) bytes$/

// logging format updated at 3af3ccc22a330be824e62a9fe17e7a3d903c157c
const re = /^recv at ([^\s]+) msg_counter=(\d+) from ([^\s]+) in WSM (\d+)\/(\d+) with payload of (\d+) bytes from MAC frame of (\d+) bytes$/

function parseEntry(line) {
  let m = line.match(re);
  if (m === null) {
    return;
  }
  return {
    time : new Date(m[1]),
    msg_counter : parseInt(m[2]),
    from : m[3],
    wsm_index_in_frame: m[4],
    wsm_total_in_frame: m[5],
    wsm_size : parseInt(m[6]),
    frame_size : parseInt(m[7]),
  }
}

class LineParser extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: false, readableObjectMode: true});

    this.buf = null;
  }
  incoming(entry) {
    if (!this.buf || entry.msg_counter !== this.buf.msg_counter) {
      if (this.buf) {
        this.push(this.buf);
      }
      this.buf = {
        time: entry.time,
        msg_counter: entry.msg_counter,
        from: entry.from,
        wsm_total: entry.wsm_total_in_frame,
        wsm_size_total: 0, // accumulating
        frame_size: entry.frame_size,
      };
    }
    this.buf.wsm_size_total += entry.wsm_size;
  }
  _transform(chunk, encoding, callback) {
    let entry = parseEntry(chunk.toString());
    if (entry) {
      this.incoming(entry);
    }
    callback();
  }
  _flush(callback) {
    if (this.buf) {
      this.push(this.buf);
    }
    callback();
  }
}

class Strip extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});
  }
  _transform(chunk, encoding, callback) {
    this.push(_.pick(chunk, 'time', 'msg_counter'));
    callback();
  }
}

exports.LineParser = LineParser;
exports.Strip = Strip;
