// @flow

import express from 'express'
import path from 'path'
import urlModule from 'url'
import bodyParser from 'body-parser'

import ProxyServer from './ProxyServer'
import storage from './storage/server'

import type { Data, Proxy } from './storage/server'

export type ClientData = {
	...Data,
	ip: string,
	proxyRunning: boolean,
}

type Options = {
	port: number,
}

export default function(options:Options) : Promise<void> {
	var app = express()

	var status = false
	var proxies = null

	app.use(express.static(path.join(__dirname, '../static')))

	app.get('/', function(req, res:express$Response) {
		Promise.resolve()
			.then(async () => {
				if(proxies && !proxies.every(p => p.isOpen())) {
					await Promise.all(proxies.map(p => p.stop()))
					proxies = null
				}
			})
			.then(()=>storage.getAll())
			.then(d =>{
				const data:ClientData = {
					...d,
					ip: req.ip,
					proxyRunning: proxies != null,
				}
				res.send(`<!doctype html>
					<title>Proxy server</title>
					<link href="/style.css" rel="stylesheet"/>
					<script type="application/json" id="data">
						${JSON.stringify(data)}
					</script>
					<div id="root">
						Loading…
					</div>
					<script src="/app.js"></script>
				`)
			})
			.catch(handleError(res))
	})

	app.get('/ip', function(req, res:express$Response) {
		res.set('content-type', 'text/plain')
		res.send(req.ip)
	})

	app.post('/toggle-server', function(req, res:express$Response) {
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
				if(data.url == null) {
					throw new Error('Base URL was not set')
				}

				var url = urlModule.parse(data.url)
				url.host = null
				proxies = data.proxies.map(p => {
					url.port = p.remotePort == null ? null : p.remotePort.toString()
					return new ProxyServer(urlModule.format(url), p.localPort)
				})
				return Promise.all(proxies.map(p => p.start()))
			})
	}

	app.put('/url', bodyParser.json({ strict: false }), function(req, res:express$Response) {
		// flowlint-next-line unclear-type:warn
		var url:string = (req.body:any)

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

	app.put('/proxies/:port', bodyParser.json(), function(req, res:express$Response) {
		// flowlint-next-line unclear-type:warn
		var proxy:Proxy = (req.body:any)
		proxy.localPort = +req.params.port
		storage.proxies.set(proxy)
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	app.delete('/proxies/:port', function(req, res:express$Response) {
		storage.proxies.delete(+req.params.port)
			.then(()=>res.sendStatus(204))
			.catch(handleError(res))
	})

	return new Promise(function(resolve, reject) {
		app.listen(options.port, function(err:?Error) {
			if(err) return reject(err)
			return resolve()
		})
	})
}

function handleError(res:express$Response) : (Error) => void {
	return error=>{res.set('content-type', 'text/plain').status(500).send(error.stack)}
}
