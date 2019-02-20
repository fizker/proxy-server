// @flow

var fs = require('fs').promises

var settings = require('../settings')

export opaque type $NonEmptyString = {
	value: string,
}

export type Proxy = {|
	url?: ?string,
	localPort: number,
	remotePort: number,
|}

export type Data = {|
	proxies: $ReadOnlyArray<Proxy>,
	url: ?string,
|}
// $FlowFixMe
var data:Data = null

function NonEmptyString(input:?string) : ?$NonEmptyString {
	if(input == null || input === '') {
		return null
	} else {
		return { value: input }
	}
}

module.exports = {
	getAll() : Promise<Data> { return ensureData().then(()=>data) },
	clearData: () => data = null,

	proxies: {
		delete: deleteProxy,
		set: setProxy,
		update: updateProxy,
		getAll: getAllProxies,
	},
	url: {
		set: setUrl,
		get: getUrl,
	},

	NonEmptyString,
}

function ensureData() : Promise<void> {
	if(data) return Promise.resolve()

	if(settings.storage == null) {
		throw new Error('storage URL is not defined')
	}

	return fs.readFile(settings.storage, 'utf8')
		.catch(()=>'{"url":null,"proxies":[]}')
		.then(JSON.parse)
		.then(d => data = d)
}
function saveData() : Promise<void> {
	if(settings.storage == null) {
		throw new Error('storage URL is not defined')
	}
	return fs.writeFile(settings.storage, JSON.stringify(data))
}

function getUrl() : Promise<?string> {
	return ensureData()
		.then(()=>data.url)
}
function setUrl(url:string) : Promise<void> {
	return ensureData()
		.then(()=>data.url=url)
		// reconfigure proxies?
		.then(saveData)
}

function getAllProxies() : Promise<$ReadOnlyArray<Proxy>> {
	return ensureData()
		.then(()=>data.proxies)
}
function deleteProxy(portOrProxy:Proxy|number) : Promise<void> {
	var port = typeof(portOrProxy) == 'object' ? portOrProxy.localPort : portOrProxy

	return ensureData()
		.then(()=>{
			var p = data.proxies.find(p => p.localPort == port)
			data.proxies = data.proxies.filter(p => p.localPort != port)
			// TODO: Shut down proxy
		})
		.then(saveData)
}
function setProxy(proxy:Proxy) : Promise<void> {
	return ensureData()
		.then(()=>{
			if(proxy.url == null) {
				proxy.url = data.url
			}
		})
		.then(()=>deleteProxy(proxy))
		.then(()=>data.proxies=data.proxies.concat(proxy).sort((p1, p2)=>p1.localPort-p2.localPort))
		// start up new proxy
		.then(saveData)
}
function updateProxy(old:Proxy, proxy:Proxy) : Promise<void> {
	return deleteProxy(old)
		.then(()=>setProxy(proxy))
}
