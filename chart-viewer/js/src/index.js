'use strict'
 
const Highcharts = require('highcharts');
require('highcharts/highcharts-3d')(Highcharts);
const $ = require('jquery');
const extend = require('extend');

$(function () {
  $.getJSON("charts/0826-front-rp14-wsm-bandwidth-2d-cl-1-7.json", (options) => {
    // shift all data series to start at the same time for easy comparison
    options.series.forEach((s) => {
      let start = Date.parse(s.data[0][0]);
      s.data.forEach((p) => {
        p[0] = Date.parse(p[0]) - start;
      });
    });
    extend(true, options, { xAxis: { labels: { formatter: function() {
      return Highcharts.dateFormat("%H:%M", this.value);
    } } } });

    let chart = new Highcharts.Chart('wsm-bandwidth-2d', options);
  });
  /*
  $.getJSON("charts/0821-front-wsm-bandwidth-3d.json", (options) => {
    let chart = new Highcharts.Chart('wsm-bandwidth-3d', options);
    $(chart.container).bind('mousedown.hc touchstart.hc', function (eStart) {
      eStart = chart.pointer.normalize(eStart);

      let posX = eStart.pageX,
      posY = eStart.pageY,
      alpha = chart.options.chart.options3d.alpha,
      beta = chart.options.chart.options3d.beta,
      newAlpha,
      newBeta,
      sensitivity = 5; // lower is more sensitive

      $(document).bind({
        'mousemove.hc touchdrag.hc': function (e) {
          // Run beta
          newBeta = beta + (posX - e.pageX) / sensitivity;
          chart.options.chart.options3d.beta = newBeta;

          // Run alpha
          newAlpha = alpha + (e.pageY - posY) / sensitivity;
          chart.options.chart.options3d.alpha = newAlpha;

          chart.redraw(false);
        },
        'mouseup touchend': function () {
          $(document).unbind('.hc');
        }
      });
    });
  });
  */
});
