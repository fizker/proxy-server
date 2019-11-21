// @flow

import { promises as fs } from 'fs'

import settings from '../settings'

export type AnyReturnValue = mixed

export opaque type $NonEmptyString = {
	value: string,
}

export type Proxy = {|
	url: string,
	localPort: number,
	remotePort: number,
	+isRunning: boolean,
|}

type ServerProxy = $ReadOnly<{|
	url: string,
	localPort: number,
	remotePort: number,
	isRunning: boolean,
|}>

export type Data = {|
	proxies: $ReadOnlyArray<ServerProxy>,
	url: ?string,
|}
var data:?Data = null
let pendingSavePromise:?Promise<void> = null
let nextSavePromise:?Promise<void> = null

function NonEmptyString(input:?string) : ?$NonEmptyString {
	if(input == null || input === '') {
		return null
	} else {
		return { value: input }
	}
}

export default {
	getAll() : Promise<Data> { return ensureData() },
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

async function ensureData() : Promise<Data> {
	if(data) {
		return data
	}

	if(settings.storage == null) {
		throw new Error('storage URL is not defined')
	}

	data = await fs.readFile(settings.storage, 'utf8')
		.catch(()=>'{"url":null,"proxies":[]}')
		.then(JSON.parse)

	return data
}
function saveData() : Promise<void> {
	const { storage } = settings
	if(storage == null) {
		throw new Error('storage URL is not defined')
	}

	if(pendingSavePromise != null) {
		if(nextSavePromise == null) {
			nextSavePromise = pendingSavePromise
				.then(saveData)
		}
		return nextSavePromise
	}

	const encoded = JSON.stringify(data)
	if(encoded == null) {
		throw new Error("could not encode data")
	}
	nextSavePromise = fs.writeFile(storage, encoded)
		.then(() => {
			nextSavePromise = null
		})
	return nextSavePromise
}

function getUrl() : Promise<?string> {
	return ensureData()
		.then((data) => data.url)
}
function setUrl(url:string) : Promise<void> {
	return ensureData()
		.then((data)=>data.url=url)
		// reconfigure proxies?
		.then(saveData)
}

function getAllProxies() : Promise<$ReadOnlyArray<ServerProxy>> {
	return ensureData()
		.then((data)=>data.proxies)
}
function deleteProxy(portOrProxy:Proxy|number) : Promise<void> {
	var port = typeof(portOrProxy) == 'object' ? portOrProxy.localPort : portOrProxy

	return ensureData()
		.then((data) => {
			var p = data.proxies.find(p => p.localPort == port)
			data.proxies = data.proxies.filter(p => p.localPort != port)
			// TODO: Shut down proxy
		})
		.then(saveData)
}
async function setProxy(proxy:Proxy) : Promise<void> {
	if(proxy.url == null) {
		throw new Error('Proxy is missing URL')
	}

	const data = await ensureData()

	await deleteProxy(proxy)

	data.proxies = data.proxies
		.concat(proxy)
		.sort((p1, p2) => p1.localPort - p2.localPort)

	// start up new proxy
	await saveData()
}
function updateProxy(old:Proxy, proxy:Proxy) : Promise<void> {
	return deleteProxy(old)
		.then(()=>setProxy(proxy))
}
