require('es6-shim')
require('promise-helpers')

var server = require('./src/server')

if(require.main != module) {
	// Included from tests or other node.js modules
	module.exports = {
		open: server,
	}
	return
}

var PORT = process.env.PORT || 8088

server({
	port: PORT
})
	.then(function() {
		console.log('Server running at ' + PORT)
	})
	.done()
return

var httpProxy = require('http-proxy')
var http = require('http')
var yargs = require('yargs')
var args = yargs
	.options('port', {
		default: 8083
	})
	.options('url', {
		default: 'http://bho.econintra.local'
	})
	.argv

var proxy = httpProxy.createProxyServer({ secure: false })

var remote = args.url + ':' + args.port
if(!remote.match(/^https?:\/\//)) {
	remote = 'http://' + remote
}

http.createServer(function(req, res) {
	res.setHeader('access-control-allow-origin', '*')
	res.setHeader('access-control-allow-headers', 'accessid,appid,econ-token')
	res.setHeader('access-control-allow-methods', 'get,post,delete,put,patch,options')

	req.headers.host = 'localhost'
	delete req.headers.cookie
	proxy.web(req, res, { target: remote})
}).listen(process.env.PORT || 8084, function() {
	console.log('Proxying to', remote)
})
