'use strict'

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
    wsm_total_in_frame: m[5]
    wsm_size : parseInt(m[6]),
    frame_size : parseInt(m[7]),
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
