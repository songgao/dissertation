#!/usr/bin/env node

'use strict'

const bandwidth = require('../lib/bandwidth');
const genChart = require('../lib/genChart');

let files = process.argv.slice(2).map((fn) => {
  return {
    path: fn,
    name: fn,
  };
});

genChart(bandwidth.Bandwidth2WSM3d, files, 'WSM Bandwidth 3D');
