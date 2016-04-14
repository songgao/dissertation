'use strict'
 
const Highcharts = require('highcharts');
require('highcharts/highcharts-3d')(Highcharts);
const $ = require('jquery');
const extend = require('extend');
const renderCharts = require('./lib/renderCharts');
const renderChooseChartsUI = require('./lib/renderChooseChartsUI');

$(() => {
  if (!renderCharts()) {
    renderChooseChartsUI();
  }
  return;
});
