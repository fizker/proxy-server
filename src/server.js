var express = require('express')
var path = require('path')
var urlModule = require('url')

var bodyParser = require('body-parser')

var ProxyServer = require('./ProxyServer')
var storage = require('./storage/server')

module.exports = function(options) {
	var app = express()

	var status = false
	var proxies = null

	app.use(express.static(path.join(__dirname, '../static')))

	app.get('/', function(req, res) {
		Promise.resolve()
			.then(() => {
				if(proxies && !proxies.every(p => p.isOpen())) {
					var p = Promise.all(proxies.map(p => p.stop()))
					proxies = null
				}
			})
			.then(()=>storage.getAll())
			.then(data =>{
				data.ip = req.ip
				data.proxyRunning = proxies != null
				res.send(`<!doctype html>
					<title>Proxy server</title>
					<link href="/style.css" rel="stylesheet"/>
					<script type="application/json" id="data">
						${JSON.stringify(data)}
					</script>
					Loading…
					<script src="/app.js"></script>
				`)
			})
			.catch(handleError(res))
	})

	app.get('/ip', function(req, res) {
		res.set('content-type', 'text/plain')
		res.send(req.ip)
	})

	app.post('/toggle-server', function(req, res) {
		var p
		if(proxies) {
			p = Promise.all(proxies.map(p => p.stop()))
			proxies = null
		} else {
			p = startProxies()
		}

		p
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	function startProxies() {
		return storage.getAll()
			.then(data => {
				var url = urlModule.parse(data.url)
				delete url.host
				proxies = data.proxies.map(p => {
					url.port = p.remotePort
					return new ProxyServer(urlModule.format(url), p.localPort)
				})
				return Promise.all(proxies.map(p => p.start()))
			})
	}

	app.put('/url', bodyParser.json({ strict: false }), function(req, res) {
		var url = req.body

		storage.url.set(url)
			.then(()=>{
				if(proxies) {
					return Promise.all(proxies.map(proxy => proxy.stop()))
						.then(startProxies)
				}
			})
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	app.put('/proxies/:port', bodyParser.json(), function(req, res) {
		var proxy = req.body
		proxy.localPort = +req.params.port
		storage.proxies.set(proxy)
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	app.delete('/proxies/:port', function(req, res) {
		storage.proxies.delete(+req.params.port)
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
