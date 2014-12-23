var express = require('express')
var path = require('path')

var bodyParser = require('body-parser')

module.exports = function(options) {
	var app = express()

	var url = null
	var proxies = {}

	app.use(express.static(path.join(__dirname, '../static')))

	app.get('/', function(req, res) {
		var allProxies = Object.keys(proxies).map(key => proxies[key])
		res.send(`<!doctype html>
			<title>Proxy server</title>
			<script type="application/json" id="data">
				${JSON.stringify({
					proxies: allProxies,
					url: url,
				})}
			</script>
			Loading…
			<script src="app.js"></script>
		`)
	})

	app.put('/url', bodyParser.json({ strict: false }), function(req, res) {
		url = req.body
		res.sendStatus(204)
	})

	app.put('/proxies/:port', bodyParser.json(), function(req, res) {
		var proxy = req.body
		proxy.localPort = req.params.port
		proxies[proxy.localPort] = proxy

		res.sendStatus(204)
	})

	app.delete('/proxies/:port', function(req, res) {
		delete proxies[req.params.port]
		res.sendStatus(204)
	})

	return new Promise(function(resolve, reject) {
		app.listen(options.port, function(err) {
			if(err) return reject(err)
			return resolve()
		})
	})
}
