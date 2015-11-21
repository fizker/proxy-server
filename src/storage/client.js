const sendJSONHeaders = { 'content-type': 'application/json' }
const fetchJSONHeaders = { 'accept': 'application/json' }

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
	ip: {
		get: getIP,
	},
}

function setUrl(url) {
	return fetch('/url', {
		method: 'put',
		body: JSON.stringify(url),
		headers: sendJSONHeaders,
	})
}

function setProxy(proxy) {
	return fetch('/proxies/' + proxy.localPort, {
		method: 'put',
		body: JSON.stringify(proxy),
		headers: sendJSONHeaders,
	})
}

function deleteProxy(portOrProxy) {
	return fetch('/proxies/' + portOrProxy.localPort || portOrProxy, { method: 'delete' })
}

function updateProxy(old, proxy) {
	var port = old.port
	return Promise.all([
		setProxy(proxy),
		port != proxy.port && deleteProxy(port),
	])
}

function toggle() {
	return fetch('/toggle-server', { method: 'post' })
}

function getIP() {
	return fetch('/ip', { headers: fetchJSONHeaders })
	.then(xhr => xhr.json())
}
