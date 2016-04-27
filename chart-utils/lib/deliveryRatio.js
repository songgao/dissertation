'use strict'

const assert = require('assert');
const EventEmitter = require('events');
const Combine = require('stream-combiner');
const _ = require('underscore');
const highChartTemplates = require('./highChartTemplates');
const rx = require('./rx');

class MetricEmitter extends EventEmitter {
  constuctor() { }
  _new_second(first) {
    this.this_second = {
      first: first,
      delivered: 1,
    };
  }
  incoming(entry, callback) {
    entry.time.setUTCMilliseconds(0);
    if (!this.this_second) {
      this._new_second(entry);
      return;
    }

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
      this.emit('metric', {
        time: this.this_second.first.time,
        delivered: this.this_second.delivered,
        expected: numPerSecond,
      });
      _.times(diff - 1, (i) => {
        this.emit('metric', {
          time: new Date(this.this_second.first.time.getTime() + 1000*(i+1) ),
          delivered: 0,
          expected: numPerSecond,
        });
      });
      this._new_second(entry);
    } else {
      ++this.this_second.delivered;
    }
  }
}

class DeliveryRatio extends require('stream').Transform {
  constructor() {
    super({writableObjectMode: true, readableObjectMode: true});

    this.metric_emitters = new Map();
    this.buf = new Map();
  }
  _get_metric_emitter(from_address) {
    if (!this.metric_emitters.get(from_address)) {
      this.metric_emitters.set(from_address, new MetricEmitter(from_address));
      this.metric_emitters.get(from_address).on('metric', (metric) => {
        const t = metric.time.getTime();
        if (!this.buf.has(t)) {
          this.buf.set(t, []);
        }
        const metrics = this.buf.get(t);
        metrics.push({from: from_address, metric: metric});
        if (metrics.length === this.metric_emitters.size) {
          const delivered = _.reduce(metrics, (memo, m) => memo + m.metric.delivered, 0);
          const expected = _.reduce(metrics, (memo, m) => memo + m.metric.expected, 0);
          this.push({
            time: new Date(t),
            delivery_ratio: delivered / expected,
          });
          this.buf.delete(t);
        }
      });
    }
    return this.metric_emitters.get(from_address);
  }
  _transform(chunk, encoding, callback) {
    assert(chunk && chunk.msg_counter !== undefined);
    this._get_metric_emitter(chunk.from).incoming(chunk);
    callback();
  }
  _flush(callback) {
    this.buf.forEach((metrics, t) => {
      const delivered = _.reduce(metrics, (memo, m) => memo + m.metric.delivered, 0);
      const expected = _.reduce(metrics, (memo, m) => memo + m.metric.expected, 0) * this.metric_emitters.size / metrics.length;
      this.push({
        time: new Date(t),
        delivery_ratio: delivered / expected,
      });
    });
    callback();
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
