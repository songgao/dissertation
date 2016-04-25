'use strict'

const utils = require('./utils');

exports.area2d = (yAxisTitle) => {
  return (series, title) => {
    series.forEach((s) => (s.data.sort((a, b) => a[0].getTime() - b[0].getTime())));
    let ret = {
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
        min: 0,
        minPadding: 0,
        title: {
          text: yAxisTitle,
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

    // heuristic to detect delivery ratio charts
    if (series[0].data[series[0].data.length/2][1] <= 1) {
      ret.yAxis.max = 1.1;
    }
  }
};

exports.scatter3d = (yAxisTitle) => {
  return (series, title) => ({
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
        text: yAxisTitle,
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
  });
};


