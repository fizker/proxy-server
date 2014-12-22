var express = require('express')

module.exports = function(options) {
	var app = express()

	app.get('/', function(req, res) {
		res.send('Hello world')
	})

	return new Promise(function(resolve, reject) {
		app.listen(options.port, function(err) {
			if(err) return reject(err)
			return resolve()
		})
	})
}
