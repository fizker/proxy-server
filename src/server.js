var express = require('express')
var path = require('path')

var bodyParser = require('body-parser')

var storage = require('./storage/server')

module.exports = function(options) {
	var app = express()

	var url = null
	var proxies = {}

	app.use(express.static(path.join(__dirname, '../static')))

	app.get('/', function(req, res) {
		storage.getAll()
			.then(data =>{
				res.send(`<!doctype html>
					<title>Proxy server</title>
					<script type="application/json" id="data">
						${JSON.stringify(data)}
					</script>
					Loading…
					<script src="app.js"></script>
				`)
			})
			.catch(handleError(res))
	})

	app.put('/url', bodyParser.json({ strict: false }), function(req, res) {
		var url = req.body
		storage.url.set(url)
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	app.put('/proxies/:port', bodyParser.json(), function(req, res) {
		var proxy = req.body
		proxy.localPort = req.params.port
		storage.proxies.set(proxy)
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	app.delete('/proxies/:port', function(req, res) {
		storage.proxies.delete(req.params.port)
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	return new Promise(function(resolve, reject) {
		app.listen(options.port, function(err) {
			if(err) return reject(err)
			return resolve()
		})
	})
}

function handleError(res) {
	return error=>res.set('content-type', 'text/plain').status(500).send(error.stack)
}
