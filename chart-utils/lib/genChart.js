'use strict'

const fs = require('fs');
const LineStream = require('byline').LineStream;
const toArray = require('stream-to-array');
const lzma = require('lzma-native');

module.exports = (chart, files, chartTitle) => {
  const streams = files.map( (file) => (
        file.path.endsWith('.xz') ?
        fs.createReadStream(file.path).pipe(lzma.createDecompressor()) :
        fs.createReadStream(file.path)
        ) );
  const data_promises = streams.map( (s) => toArray(
        s.pipe(new LineStream()).pipe(chart.stream())));

  Promise.all(data_promises).then((all) => {
    let series = all.map( (data, i) => ({
      name: files[i].name,
      data: data
    }));
    process.stdout.write(
        JSON.stringify(chart.chartTemplate(series, chartTitle)));
  }).catch( (e) => {
    console.log('promise error: ' + e.message);
    console.log(e.stack);
  });
}
