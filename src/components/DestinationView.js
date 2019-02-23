// @flow

import * as React from 'react'

import URLView from './Url'
import ProxyView from './Proxy'

import type { Proxy } from '../storage/server'
import type { Destination } from '../transforms/destination'

function RunIndicatorView({ isRunning }:{ isRunning: boolean }) {
	return <span>
		<span
			className={'running-indicator running-indicator--' + (isRunning ? 'on': 'off')}
		/>
		{isRunning ? 'Running' : 'Stopped'}
	</span>
}

type Props = $ReadOnly<{|
	destination: Destination,
	ip: string,

	onToggleProxy: (Proxy) => void,
	onDeleteProxy: (Proxy) => void,
	onUpdateProxy: (old:Proxy, updatedProxy:Proxy) => void,
	onCreateProxy: (Proxy) => void,
	validateProxy: (old:?Proxy, proxy:Proxy) => ?string,
|}>

export default function Server({ validateProxy, destination, ip, onToggleProxy, onDeleteProxy, onCreateProxy, onUpdateProxy }:Props) {
	const firstProxy = destination.proxies[0]
	return <div>
		{firstProxy != null && <button onClick={() => onToggleProxy(firstProxy)}>
			{destination.isRunning ? 'Turn off' : 'Turn on'}
		</button>}
		<RunIndicatorView isRunning={destination.isRunning} />
		<URLView
			url={destination.url}
			onChangeUrl={url => {
				destination.proxies.forEach(p => {
					onUpdateProxy(p, {
						...p,
						url,
					})
				})
			}}
			ip={ip}
		/>
		<div>
			<h1>Proxies</h1>
			{destination.proxies.map(proxy => <ProxyView
				key={proxy.localPort}
				url={destination.url}
				proxy={proxy}
				onChangeProxy={p => onUpdateProxy(proxy, p)}
				onDelete={() => onDeleteProxy(proxy)}
				validateProxy={p => validateProxy(proxy, p)}
			/>)}
			<ProxyView
				url={destination.url}
				onChangeProxy={onCreateProxy}
				validateProxy={(p) => validateProxy(null, p)}
			/>
		</div>
	</div>
}
