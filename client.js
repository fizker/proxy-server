// @flow

var React = require('react')
import ReactDOM from 'react-dom'

import type { ClientData } from './src/server'

const bootstrappedData = document.querySelector('#data')
if(bootstrappedData == null) {
	throw new Error('bootstrapped data not found')
}
const data:ClientData = JSON.parse(bootstrappedData.innerHTML)
var App = require('./src/components/App')

const rootContainer = document.querySelector('#root')
if(rootContainer == null) {
	throw new Error('root container not found')
}
ReactDOM.render(<App data={data}/>, rootContainer)
