// @flow

import * as React from 'react'

import URLView from './Url'
import ProxyView from './Proxy'

import type { Proxy, AnyReturnValue } from '../storage/server'
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

	onDeleteDestination: () => AnyReturnValue,
	onToggleProxy: (Proxy) => AnyReturnValue,
	onDeleteProxy: (Proxy) => AnyReturnValue,
	onUpdateProxy: (old:Proxy, updatedProxy:Proxy) => AnyReturnValue,
	onCreateProxy: (Proxy) => AnyReturnValue,
	validateProxy: (old:?Proxy, proxy:Proxy) => ?string,
|}>

export default function DestinationView({
	validateProxy, destination, ip,
	onDeleteDestination,
	onToggleProxy, onDeleteProxy, onCreateProxy, onUpdateProxy,
}:Props) {
	const firstProxy = destination.proxies[0]
	return <div>
		<h1>Destination</h1>
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
		{firstProxy != null && <div>
			<button onClick={() => onToggleProxy(firstProxy)}>
				{destination.isRunning ? 'Turn off' : 'Turn on'}
			</button>
			<RunIndicatorView isRunning={destination.isRunning} />
		</div>}
		<button onClick={onDeleteDestination}>
			Delete destination
		</button>
		<div>
			<h2>Proxies</h2>
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
