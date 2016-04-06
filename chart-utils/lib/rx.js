'use strict'

const re = /^recv at ([^\s]+) msg_counter=(\d+) from ([^\s]+) in WSM 1\/1 with (\d+) bytes payload from MAC frame of (\d+) bytes$/

function parseEntry(line) {
  let m = line.match(re);
  if (m === null) {
    return;
  }
  return {
    time : new Date(m[1]),
    msg_counter : parseInt(m[2]),
    from : m[3],
    wsm_size : parseInt(m[4]),
    frame_size : parseInt(m[5]),
  }
}

class LineParser extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: false, readableObjectMode: true});
  }
  _transform(chunk, encoding, callback) {
    let entry = parseEntry(chunk.toString());
    if (entry) {
      this.push(entry);
    }
    callback();
  }
}

exports.LineParser = LineParser
