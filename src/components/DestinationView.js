// @flow

import * as React from 'react'

import URLView from './Url'
import ProxyView from './Proxy'

import type { Proxy } from '../storage/server'

function RunIndicatorView({ isRunning }:{ isRunning: boolean }) {
	return <span>
		<span
			className={'running-indicator running-indicator--' + (isRunning ? 'on': 'off')}
		/>
		{isRunning ? 'Running' : 'Stopped'}
	</span>
}

type ProxyDestination = $ReadOnly<{
	isRunning: boolean,
	url: string,
	proxies: $ReadOnlyArray<Proxy>,
}>

type Props = $ReadOnly<{|
	destination: ProxyDestination,
	ip: string,

	onToggleProxies: () => void,
	onChangeURL: (string) => void,
	onDeleteProxy: (Proxy) => void,
	onUpdateProxy: (old:Proxy, updatedProxy:Proxy) => void,
	onCreateProxy: (Proxy) => void,
|}>

export default function Server({ destination, ip, onChangeURL, onToggleProxies, onDeleteProxy, onCreateProxy, onUpdateProxy }:Props) {
	return <div>
		<button onClick={onToggleProxies}>
			{destination.isRunning ? 'Turn off' : 'Turn on'}
		</button>
		<RunIndicatorView isRunning={destination.isRunning} />
		<URLView
			url={destination.url}
			onChangeUrl={onChangeURL}
			ip={ip}
		/>
		<div>
			<h1>Proxies</h1>
			{destination.proxies.map(proxy => <ProxyView
				key={proxy.localPort}
				proxy={proxy}
				onChangeProxy={p => onUpdateProxy(proxy, p)}
				onDelete={() => onDeleteProxy(proxy)}
				validateProxy={p => validateProxy(destination.proxies, proxy, p)}
			/>)}
			<ProxyView
				onChangeProxy={onCreateProxy}
				validateProxy={(p) => validateProxy(destination.proxies, null, p)}
			/>
		</div>
	</div>
}

function validateProxy(proxies:$ReadOnlyArray<Proxy>, old:?Proxy, proxy:Proxy) : ?string {
	if(old && old.localPort == proxy.localPort) {
		return null
	}

	if(proxies.find(p => p.localPort == proxy.localPort)) {
		return 'Port-number is taken'
	}

	return null
}
