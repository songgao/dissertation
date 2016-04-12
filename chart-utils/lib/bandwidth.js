'use strict'

const assert = require('assert');
const machina = require('machina');
const highChartTemplates = require('./highChartTemplates');
const tx = require('./tx');

class Bandwidth extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});

    this.fsm = new machina.Fsm({
      namespace: machina.utils.makeFsmNamespace(),
      initialState: "uninitialized",
      new_minute: function(first) {
        first.time.setUTCMilliseconds(0);
        this.this_minute = {};
        this.this_minute.first = first;
        this.this_minute.data_point = {
          time: first.time,
          wsm_bytes: first.wsm_size,
          frame_bytes: first.frame_size,
          position: first.position,
        };
      },
      states: {
        uninitialized: {
          entry: function(entry) {
            if (entry.latitude !== 0 || entry.longitude !== 0 || entry.height !== 0) {
              this.new_minute(entry);
              this.transition('first-minute');
            }
          }
        },
        'first-minute': {
          entry: function(entry) {
            if (entry.time.getUTCSeconds() != this.this_minute.first.time.getUTCSeconds()) {
              this.new_minute(entry);
              this.transition('aggregating');
            }
          }
        },
        aggregating: {
          entry: function(entry) {
            if (entry.time.getUTCSeconds() == this.this_minute.first.time.getUTCSeconds()) {
              this.this_minute.data_point.wsm_bytes += entry.wsm_size * entry.wsm_repeat;
              this.this_minute.data_point.frame_bytes += entry.frame_size;
            } else {
              this.emit('data_point', this.this_minute.data_point);
              this.new_minute(entry);
            }
          }
        }
      },
      entry: function(entry) {
        if (!entry) {
          return;
        }
        this.handle('entry', entry);
      }
    });
    this.fsm.on('data_point', function(data_point) {
      this.push(data_point);
    }.bind(this));
  }
  _transform(chunk, encoding, callback) {
    assert(chunk && chunk.position !== undefined);
    this.fsm.entry(chunk);
    callback();
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
  chartTemplate: highChartTemplates.scatter3d,
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
  processor: (readable) => readable.pipe(new tx.LineParser()).pipe(new Bandwidth()).pipe(new Bandwidth2WSM2d),
  chartTemplate: highChartTemplates.area2d,
}

