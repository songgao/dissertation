#!/usr/bin/env node

'use strict'

const assert = require('assert');
const _ = require('underscore');

const bandwidth = require('./lib/bandwidth');
const deliveryRatio = require('./lib/deliveryRatio');
const genChart = require('./lib/genChart');

const chartMapping = {
  'wsm-bandwidth-2d': {
    title: 'WSM Bandwidth 2D',
    chart: bandwidth.BandwidthWSM2d,
  },
  'wsm-bandwidth-3d': {
    title: 'WSM Bandwidth 3D',
    chart: bandwidth.BandwidthWSM3d,
  },
  'frame-bandwidth-2d': {
    title: 'Frame Bandwidth 2D',
    chart: bandwidth.BandwidthFrame2d,
  },
  'frame-bandwidth-3d': {
    title: 'Frame Bandwidth 3D',
    chart: bandwidth.BandwidthFrame3d,
  },
  'delivery-ratio-2d': {
    title: 'Delivery Ratio 2D',
    chart: deliveryRatio.DeliveryRatio2d,
  }
};

const argv = require('yargs').options( 'names', {
  alias: 'n', demand: true, type: 'string', array: true,
}).options( 'paths', {
  alias: 'p', demand: true, type: 'string', array: true,
}).options( 'chart', {
  alias: 'c', demand: true, choices: _.keys(chartMapping),
}).check(argv => argv.names.length === argv.paths.length).help('help').argv;

const files = _.zip(argv.names, argv.paths).map((a) => ({ name: a[0], path: a[1] }));
const mapped = chartMapping[argv.chart];
genChart(mapped.chart, files, mapped.title);
