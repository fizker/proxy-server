// @flow

import type { Proxy } from '../storage/server'

export type Destination = $ReadOnly<{
	url: string,
	proxies: $ReadOnlyArray<Proxy>,
	isRunning: boolean,
}>

export function createDestinationsForProxies(proxies:$ReadOnlyArray<Proxy>) : $ReadOnlyArray<Destination> {
	const grouped = {}
	proxies.forEach(proxy => {
		const url = proxy.url
		if(url == null) {
			return
		}

		const group = grouped[url] || []
		group.push(proxy)
		grouped[url] = group
	})

	const destinations = Object.keys(grouped).map(url => {
		const proxies = grouped[url]
		return {
			url,
			proxies,
			isRunning: false,
		}
	})

	return destinations
}
