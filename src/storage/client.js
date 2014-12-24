var fajax = require('fajax')

module.exports = {
	proxies: {
		delete: deleteProxy,
		set: setProxy,
		update: updateProxy,
	},
	url: {
		set: setUrl,
	},
	status: {
		toggle,
	},
}

function setUrl(url) {
	return fajax.put('/url',{ json: url })
}

function setProxy(proxy) {
	return fajax.put('/proxies/' + proxy.localPort, { json: proxy })
}

function deleteProxy(portOrProxy) {
	return fajax.delete('/proxies/' + portOrProxy.localPort || portOrProxy)
}

function updateProxy(port, proxy) {
	return Promise.all([
		setProxy(proxy),
		port != proxy.port && deleteProxy(port),
	])
}

function toggle() {
	return fajax.post('/toggle-server')
}