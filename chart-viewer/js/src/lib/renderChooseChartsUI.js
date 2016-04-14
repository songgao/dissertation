'use strict'
 
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const getChartList = () => {
  const tmp = $('<div></div>');
  return new Promise((resolve, reject) => {
    tmp.load('/charts pre>a', () => {
      resolve(tmp.children().toArray().map(a => a.innerText));
    });
  });
};

module.exports = () => {
  getChartList().then((list) => {
    const lis = list.map( fn => (<li key={fn}>{fn}</li>) );
    ReactDOM.render(
        <ul>{lis}</ul>,
        document.getElementById('main')
        );
  });
};
