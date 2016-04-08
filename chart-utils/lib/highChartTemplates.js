'use strict'

const utils = require('./utils');

exports.area2d = (series, title) => {
  return {
    chart: {
      renderTo: 'container',
      margin: 100,
      zoomType: 'x'
    },
    title: {
      text: title,
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time'
      }
    },
    yAxis: {
      minPadding: 0,
      title: {
        text: 'Bandwidth (byte/s)'
      }
    },
    plotOptions: {
      area: {
        turboThreshold: 0,
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },

    series: series
  };
};

exports.scatter3d = (series, title) => {
  return {
    chart: {
      renderTo: 'container',
      margin: 100,
      type: 'scatter',
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 30,
        depth: 250,
        viewDistance: 5,
        fitToPlot: false,
        frame: {
          bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
          back: { size: 1, color: 'rgba(0,0,0,0.04)' },
          side: { size: 1, color: 'rgba(0,0,0,0.06)' }
        }
      }
    },
    title: {
      text: title,
    },
    plotOptions: {
      scatter: {
        turboThreshold: 0,
        width: 2,
        height: 2,
        depth: 2
      }
    },
    yAxis: {
      minPadding: 0,
      title: {
        text: 'Bandwidth (byte/s)'
      }
    },
    xAxis: {
      title: {
        text: 'Easting'
      }
    },
    zAxis: {
      title: {
        text: 'Northing'
      }
    },
    series: series,
  };
};


