// @flow

import * as React from 'react'

import URLView from './Url'
import ProxiesView from './Proxies'

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
	performAction: (()=>Promise<mixed>) => void,
|}>

export default function Server({ destination, ip, performAction, onChangeURL, onToggleProxies }:Props) {
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
		<ProxiesView
			proxies={destination.proxies}
			performAction={performAction}
		/>
	</div>
}
