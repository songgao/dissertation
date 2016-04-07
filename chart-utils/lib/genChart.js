'use strict'

const fs = require('fs');
const LineStream = require('byline').LineStream;
const toArray = require('stream-to-array');

module.exports = (chart, files, chartTitle) => {
  let data_promises = files.map(
      file => toArray(
        chart.processor(fs.createReadStream(file.path).pipe(new LineStream()))
        )
      );

  Promise.all(data_promises).then((all) => {
    let series = all.map((data, i) => {
      return {
        name: files[i].name,
        data: data
      };
    });
    process.stdout.write(JSON.stringify(chart.chartTemplate(series, chartTitle)));
  });
}