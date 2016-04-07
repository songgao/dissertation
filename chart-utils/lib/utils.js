'use strict'

const _ = require('underscore');

exports.findBounds = data => _.reduce(data, (memo, item) => {
  memo.x.min = Math.min(memo.x.min, item[0]);
  memo.y.min = Math.min(memo.y.min, item[1]);
  memo.z.min = Math.min(memo.z.min, item[2]);

  memo.x.max = Math.max(memo.x.max, item[0]);
  memo.y.max = Math.max(memo.y.max, item[1]);
  memo.z.max = Math.max(memo.z.max, item[2]);
  return memo;
}, {
  x: {min: Number.MAX_VALUE, max: Number.MIN_VALUE},
  y: {min: Number.MAX_VALUE, max: Number.MIN_VALUE},
  z: {min: Number.MAX_VALUE, max: Number.MIN_VALUE},
});

exports.array_cat = (list) => _.reduce(list, (a, b) => { return a.concat(b); }, []);
exports.sum = (list) => _.reduce(list, (memo, num) => { return memo + num; }, 0)
