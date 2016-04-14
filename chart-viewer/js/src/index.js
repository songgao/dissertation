'use strict'
 
const Highcharts = require('highcharts');
require('highcharts/highcharts-3d')(Highcharts);
const $ = require('jquery');
const extend = require('extend');

const getURLParameter = (sParam) => {
  const sURLVariables = window.location.search.substring(1).split('&');
  for (let i = 0; i < sURLVariables.length; i++) {
    const sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

const addChart2d = (id, chart_fn) => {
  $.getJSON('charts/' + chart_fn).then((options) => {
    // shift all data series to start at the same time for easy comparison
    options.series.forEach((s) => {
      const start = Date.parse(s.data[0][0]);
      s.data.forEach((p) => {
        p[0] = Date.parse(p[0]) - start;
      });
    });
    extend(true, options, { xAxis: { labels: { formatter: function() {
      return Highcharts.dateFormat("%H:%M", this.value);
    } } } });
    extend(true, options, { subtitle: { text: chart_fn } });

    new Highcharts.Chart(id, options);
  });
}

const addChart3d = (id, chart_fn) => {
  $.getJSON('charts/' + chart_fn).then((options) => {
    extend(true, options, { subtitle: { text: chart_fn } });
    const chart = new Highcharts.Chart(id, options);
    $(chart.container).bind('mousedown.hc touchstart.hc', (eStart) => {
      eStart = chart.pointer.normalize(eStart);

      let posX = eStart.pageX,
      posY = eStart.pageY,
      alpha = chart.options.chart.options3d.alpha,
      beta = chart.options.chart.options3d.beta,
      newAlpha,
      newBeta,
      sensitivity = 5; // lower is more sensitive

      $(document).bind({
        'mousemove.hc touchdrag.hc': (e) => {
          // Run beta
          newBeta = beta + (posX - e.pageX) / sensitivity;
          chart.options.chart.options3d.beta = newBeta;

          // Run alpha
          newAlpha = alpha + (e.pageY - posY) / sensitivity;
          chart.options.chart.options3d.alpha = newAlpha;

          chart.redraw(false);
        },
        'mouseup touchend': () => {
          $(document).unbind('.hc');
        }
      });
    });
  });
}


$(() => {
  let counter = 0;
  const addChart = (param_name, addChartFunc) => {
    let charts = getURLParameter(param_name);
    if (charts) {
      charts = charts.split(',').map(url=>url.trim());
      charts.forEach( (chart_fn) => {
        if (!chart_fn) {
          return;
        }
        const id = "chart-" + (++counter).toString();
        $('body').append('<div id="' + id +'"></div>');
        addChartFunc(id, chart_fn);
      });
    }
  };
  addChart('charts2d', addChart2d);
  addChart('charts3d', addChart3d);
  return;
});
