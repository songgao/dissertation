#!/usr/bin/env node

'use strict'

const _ = require('underscore');
const fs = require('fs');

const argv = require('yargs').options( 'chart-files', {
  alias: 'c', demand: true, type: 'string', array: true,
}).options( 'xAxis', {
  alias: 'x', demand: true, type: 'number', array: true,
}).help('help').argv;

const charts = argv.c.map(require).map(c => c.series);
charts.forEach(chart => {
  chart.forEach( s => {
    s.data = _.reduce(s.data.map(d => d[1]), (m, n) =>  m + n, 0) / s.data.length;
  });
});

let data = charts.map(series => _.object(series.map(s => s.name), series.map(s => s.data)));

data = _.reduce(data, (m, c) => {
  _.keys(m).map(k => {
    m[k].push(c[k]);
  });
  return m;
}, _.object(_.keys(data[0]), _.keys(data[0]).map(()=>[])));

data = _.keys(data).map((k) => ({
  'name': k,
  'data': data[k],
}));

const chart = {
  chart: {
    type: 'line'
  },
  title: {
    text: 'Delivery Ratio vs Number of Nodes'
  },
  xAxis: {
    categories: ['2', '4', '6', '8', '10', '12', '14'],
    title: {
      text: 'Number of Nodes',
    }
  },
  yAxis: {
    title: {
      text: 'Delivery Ratio'
    }
  },
  series: data,
};

process.stdout.write(JSON.stringify(chart));
