// @flow

import type { Proxy } from './server'

const sendJSONHeaders = { 'content-type': 'application/json' }
const fetchJSONHeaders = { 'accept': 'application/json' }

export default {
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

function setUrl(url:string) : Promise<Response> {
	return fetch('/url', {
		method: 'put',
		body: JSON.stringify(url),
		headers: sendJSONHeaders,
	})
}

function setProxy(proxy:Proxy) : Promise<Response> {
	return fetch('/proxies/' + proxy.localPort, {
		method: 'put',
		body: JSON.stringify(proxy),
		headers: sendJSONHeaders,
	})
}

function deleteProxy(proxy:Proxy) : Promise<Response> {
	return fetch('/proxies/' + proxy.localPort, { method: 'delete' })
}

function updateProxy(old:Proxy, proxy:Proxy) : Promise<void> {
	// TODO: essentially dead code; proxies do not have a .port prop
	//var port = old.port
	return Promise.all([
		setProxy(proxy),
		//port != proxy.port && deleteProxy(port),
	])
	.then(() => {})
}

function toggle() : Promise<Response> {
	return fetch('/toggle-server', { method: 'post' })
}

function getIP() : Promise<string> {
	return fetch('/ip', { headers: fetchJSONHeaders })
	.then(xhr => xhr.json())
}
