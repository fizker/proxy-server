var React = require('react')
import ReactDOM from 'react-dom'

var data = JSON.parse(document.querySelector('#data').innerHTML)
var App = require('./src/components/App')

ReactDOM.render(<App data={data}/>, document.body)
