'use strict'

const assert = require('assert');
const machina = require('machina');
const Combine = require('stream-combiner');
const highChartTemplates = require('./highChartTemplates');
const tx = require('./tx');

class Bandwidth extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});

    const self = this;

    this.fsm = new machina.Fsm({
      namespace: machina.utils.makeFsmNamespace(),
      initialState: "uninitialized",
      new_second: function(first) {
        first.time.setUTCMilliseconds(0);
        this.this_second = {};
        this.this_second.first = first;
        this.this_second.data_point = {
          time: first.time,
          wsm_bytes: first.wsm_size,
          frame_bytes: first.frame_size,
          position: first.position,
        };
      },
      states: {
        uninitialized: {
          entry: function(entry, callback) {
            if (entry.latitude !== 0 || entry.longitude !== 0 || entry.height !== 0) {
              this.new_second(entry);
              this.transition('first-minute');
            }
            callback();
          },
          flush: function(callback) {
            callback();
          }
        },
        'first-minute': {
          entry: function(entry, callback) {
            if (entry.time.getUTCSeconds() != this.this_second.first.time.getUTCSeconds()) {
              this.new_second(entry);
              this.transition('aggregating');
            }
            callback();
          },
          flush: function(callback) {
            callback();
          }
        },
        aggregating: {
          entry: function(entry, callback) {
            if (entry.time.getUTCSeconds() == this.this_second.first.time.getUTCSeconds()) {
              this.this_second.data_point.wsm_bytes += entry.wsm_size * entry.wsm_repeat;
              this.this_second.data_point.frame_bytes += entry.frame_size;
            } else {
              self.push(this.this_second.data_point);
              this.new_second(entry);
            }
            callback();
          },
          flush: function(callback) {
            self.push(this.this_second.data_point);
            callback();
          }
        }
      },
      entry: function(entry, callback) {
        if (!entry) {
          return;
        }
        this.handle('entry', entry, callback);
      },
      flush: function(callback) {
        this.handle('flush', callback);
      }
    });
  }
  _transform(chunk, encoding, callback) {
    assert(chunk && chunk.position !== undefined);
    this.fsm.entry(chunk, () => {
      callback();
    });
  }
  _flush(callback) {
    this.fsm.flush(callback);
  }
}

const latlong2utm = require('coordinator')('latlong', 'utm');

class Bandwidth2WSM3d extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});
  }
  _transform(chunk, encoding, callback) {
    let en = latlong2utm(chunk.position.latitude, chunk.position.longitude);
    this.push([en.easting, chunk.wsm_bytes, en.northing]);
    callback();
  }
}

exports.Bandwidth2WSM3d = {
  processor: (readable) => readable.pipe(new tx.LineParser()).pipe(new Bandwidth()).pipe(new Bandwidth2WSM3d),
  stream: () => Combine(new tx.LineParser(), new Bandwidth(), new Bandwidth2WSM3d()),
  chartTemplate: highChartTemplates.scatter3d('Bandwidth (byte/s)'),
}

class Bandwidth2WSM2d extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});
  }
  _transform(chunk, encoding, callback) {
    this.push([chunk.time, chunk.wsm_bytes]);
    callback();
  }
}

exports.Bandwidth2WSM2d = {
  processor: (readable) => readable.pipe(new tx.LineParser()).pipe(new Bandwidth()).pipe(new Bandwidth2WSM2d()),
  stream: () => Combine(new tx.LineParser(), new Bandwidth(), new Bandwidth2WSM2d()),
  chartTemplate: highChartTemplates.area2d('Bandwidth (byte/s)'),
}

