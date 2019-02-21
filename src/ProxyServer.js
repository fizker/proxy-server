// @flow

import http from 'http'
import httpProxy from 'http-proxy'

interface HTTPProxy {
	web(req: http.IncomingMessage, res: http.ServerResponse, options: { target: string }) : void
}

export default class ProxyServer {
	port: number
	url: string
	proxy: HTTPProxy
	server: http.Server
	_isOpen: boolean

	constructor(url:string, port:number) {
		this.port = port
		this.url = url
		this.proxy = httpProxy.createProxyServer({ secure: false })
			.on('error', e=>this.stop())

		this._isOpen = false
	}

	start() : Promise<void> {
		if(this.isOpen()) return Promise.resolve()

		this.server = http.createServer((req, res) => {
			res.setHeader('access-control-allow-origin', '*')
			res.setHeader('access-control-allow-headers', 'accessid,appid,econ-token')
			res.setHeader('access-control-allow-methods', 'get,post,delete,put,patch,options')

			delete req.headers.cookie

			this.proxy.web(req, res, { target: this.url })
		})

		return new Promise((res, rej) => this.server.listen(this.port, (err) => err ? rej(err) : res()))
			.then(()=>{this._isOpen = true})
	}

	stop() : Promise<void> {
		if(!this.isOpen()) return Promise.resolve()
		return new Promise((res, rej) => this.server.close((err) => err ? rej(err) : res()))
			.then(()=>{this._isOpen = false})
	}

	isOpen() : boolean {
		return !!this._isOpen
	}
}
