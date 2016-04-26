'use strict'
 
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');

const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const FormControl = require('react-bootstrap').FormControl;

const getChartList = () => {
  const tmp = $('<div></div>');
  return new Promise((resolve, reject) => {
    tmp.load('./charts pre>a', () => {
      resolve(tmp.children().toArray().map(a => a.innerText));
    });
  });
};

const Selector = React.createClass({
  getInitialState: function() {
    return { selected: [] };
  },
  handleSelectChange: function(e) {
    const selected = [].slice.call(e.target.selectedOptions).map( (op) => op.value);
    this.setState({ selected: selected });
    if (this.props.onChange) {
      this.props.onChange(this.props.selectorName, selected);
    }
  },
  render: function() {
    const options = this.props.fileNames.map( fn => (
          <option value={fn}>{fn}</option>
          ) );
    return (
        <FormControl componentClass="select" multiple onChange={this.handleSelectChange} value={this.state.selected} size={options.length + 1}>
          {options}
        </FormControl>
        );
  }
});

const UI = React.createClass({
  getInitialState() {
    return {
      '2d': [],
      '3d': [],
    }
  },
  onChange: function(selectorName, selectedFileNames) {
    let state = {};
    state[selectorName] = selectedFileNames;
    this.setState(state);
  },
  render: function() {
    const fns2d = this.state['2d'].join(',');
    const fns3d = this.state['3d'].join(',');
    const url = `./?charts2d=${fns2d}&charts3d=${fns3d}`;
    return (
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              <a href={url}>Current URL: {url}</a>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={6}>
              <Selector selectorName='2d' onChange={this.onChange} fileNames={this.props.fileNames} />
            </Col>
            <Col xs={6} md={6}>
              <Selector selectorName='3d' onChange={this.onChange} fileNames={this.props.fileNames} />
            </Col>
          </Row>
        </Grid>
        );
  }
});

module.exports = () => {
  getChartList().then((list) => {
    ReactDOM.render(
        <UI fileNames={list} />,
        document.getElementById('main')
        );
  });
};
