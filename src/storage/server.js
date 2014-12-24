var fs = require('fs')

var settings = require('../settings')

var data = null

module.exports = {
	getAll: ()=>ensureData().then(()=>data),
	proxies: {
		delete: deleteProxy,
		set: setProxy,
		update: updateProxy,
		getAll: getAllProxies,
	},
	url: {
		set: setUrl,
		get: getUrl,
	}
}

function ensureData() {
	if(data) return Promise.resolve()

	return Promise.nfcall(fs.readFile, settings.storage, 'utf8')
		.catch(()=>'{"url":null,"proxies":[]}')
		.then(JSON.parse)
		.then(d => data = d)
}
function saveData() {
	return Promise.nfcall(fs.writeFile, settings.storage, JSON.stringify(data))
}

function getUrl() {
	return ensureData()
		.then(()=>data.url)
}
function setUrl(url) {
	return ensureData()
		.then(()=>data.url=url)
		// reconfigure proxies?
		.then(saveData)
}

function getAllProxies() {
	return ensureData()
		.then(()=>data.proxies)
}
function deleteProxy(port) {
	return ensureData()
		.then(()=>{
			var p = data.proxies.find(p => p.localPort == port)
			data.proxies = data.proxies.filter(p => p.localPort != port)
			// TODO: Shut down proxy
		})
		.then(saveData)
}
function setProxy(proxy) {
	return deleteProxy(proxy.localPort)
		.then(()=>data.proxies=data.proxies.concat(proxy).sort((p1, p2)=>p1.localPort-p2.localPort))
		// start up new proxy
		.then(saveData)
}
function updateProxy(old, proxy) {
	return deleteProxy(old)
		.then(()=>setProxy(proxy))
}