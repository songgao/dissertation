'use strict'

// before 3af3ccc22a330be824e62a9fe17e7a3d903c157c
// const re = /^send at ([^\s]+) msg_counter=(\d+) lat,long,h=([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?) in WSM 1\/1 with payload of (\d+) bytes in MAC frame of (\d+) bytes$/

// logging format updated at 3af3ccc22a330be824e62a9fe17e7a3d903c157c
const re = /^send at ([^\s]+) msg_counter=(\d+) lat,long,h=([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?) in WSM with payload of (\d+) bytes, repeated (\d+) time\(s\), in MAC frame of (\d+) bytes$/

function parseEntry(line) {
  let m = line.match(re);
  if (m === null) {
    return null;
  }
  return {
    time : new Date(m[1]),
    msg_counter : parseInt(m[2]),
    position: {
      latitude : parseFloat(m[3]),
      longitude : parseFloat(m[4]),
      height : parseFloat(m[5]),
    },
    wsm_size : parseInt(m[6]),
    wsm_repeat: parseInt(m[7]),
    frame_size : parseInt(m[8]),
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
