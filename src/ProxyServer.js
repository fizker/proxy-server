var http = require('http')
var httpProxy = require('http-proxy')

class ProxyServer {
	constructor(url, port) {
		this.port = port
		this.url = url
		this.proxy = httpProxy.createProxyServer({ secure: false })
			.on('error', e=>this.stop())
	}

	start() {
		if(this.isOpen()) return Promise.resolve()

		this.server = http.createServer((req, res) => {
			res.setHeader('access-control-allow-origin', '*')
			res.setHeader('access-control-allow-headers', 'accessid,appid,econ-token')
			res.setHeader('access-control-allow-methods', 'get,post,delete,put,patch,options')

			delete req.headers.cookie

			this.proxy.web(req, res, { target: this.url })
		})

		return Promise.nfcall(this.server.listen.bind(this.server), this.port)
			.then(()=>{this._isOpen = true})
	}

	stop() {
		if(!this.isOpen()) return Promise.resolve()
		return Promise.nfcall(this.server.close.bind(this.server))
			.then(()=>{this._isOpen = false})
	}

	isOpen() {
		return !!this._isOpen
	}
}

module.exports = ProxyServer
