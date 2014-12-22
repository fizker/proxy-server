var React = require('react')

var data = JSON.parse(document.querySelector('#data').innerHTML)
var Proxies = require('./src/components/Proxies')

React.render(<Proxies proxies={data.proxies}/>, document.body)
