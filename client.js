require('es6-shim')
require('promise-helpers')

var React = require('react')

var data = JSON.parse(document.querySelector('#data').innerHTML)
var App = require('./src/components/App')

React.render(<App data={data}/>, document.body)
