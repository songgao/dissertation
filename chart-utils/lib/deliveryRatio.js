'use strict'

const assert = require('assert');
const machina = require('machina');
const Combine = require('stream-combiner');
const _ = require('underscore');
const highChartTemplates = require('./highChartTemplates');
const rx = require('./rx');

class DeliveryRatio extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});

    const self = this;

    this.fsm = new machina.Fsm({
      namespace: machina.utils.makeFsmNamespace(),
      initialState: "uninitialized",
      new_second: function(first) {
        first.time.setUTCMilliseconds(0);
        this.this_second = {
          first: first,
          delivered: 1,
        };
      },
      states: {
        uninitialized: {
          entry: function(entry, callback) {
            if (entry) {
              this.new_second(entry);
              this.transition('aggregating');
            }
            callback()
          }
        },
        aggregating: {
          entry: function(entry, callback) {
            let diff = entry.time.getUTCSeconds() - this.this_second.first.time.getUTCSeconds();
            if (diff < 0) { // second wrapped around from 59 to 0
              diff += 60;
            }
            if (diff !== 0) {
              let msg_counter_diff = entry.msg_counter - this.this_second.first.msg_counter;
              if (msg_counter_diff < 0) { // msg_counter wrapped around from 65535 to 0
                msg_counter_diff += 65536;
              }
              const numPerSecond = (msg_counter_diff) / diff;
              const this_second_ratio = this.this_second.delivered / numPerSecond
              self.push({
                time: this.this_second.first.time,
                delivery_ratio: this_second_ratio > 1 ? 1 : this_second_ratio,
              });
              _.times(diff - 1, (i) => {
                self.push({
                  time: new Date(this.this_second.first.time + 1000*(i+1) ),
                  delivery_ratio: 0,
                });
              });
              this.new_second(entry);
            } else {
              ++this.this_second.delivered;
            }
            callback()
          }
        }
      },
      entry: function(entry, callback) {
        if (!entry) {
          return;
        }
        this.handle('entry', entry, callback);
      }
    });
  }
  _transform(chunk, encoding, callback) {
    assert(chunk && chunk.msg_counter !== undefined);
    this.fsm.entry(chunk, callback);
  }
}

class DeliveryRatio2d extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});
  }
  _transform(chunk, encoding, callback) {
    this.push([chunk.time, chunk.delivery_ratio]);
    callback();
  }
}

exports.DeliveryRatio2d = {
  processor: (readable) => readable.pipe(new rx.LineParser()).pipe(new rx.Strip()).pipe(new DeliveryRatio()).pipe(new DeliveryRatio2d()),
  stream: () => Combine(new rx.LineParser(), new rx.Strip(), new DeliveryRatio(), new DeliveryRatio2d()),
  chartTemplate: highChartTemplates.area2d('DeliveryRatio'),
}
