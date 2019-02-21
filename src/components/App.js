// @flow

import * as React from 'react'

import CreateDestinationView from './CreateDestinationView'
import DestinationView from './DestinationView'
import storage from '../storage/client'

import type { ClientData } from '../server'

type Props = {|
	data: ClientData,
|}

export default class App extends React.Component<Props> {
	render() {
		const { data: { proxies, url, proxyRunning, ip } } = this.props

		if(url == null) {
			return <CreateDestinationView
				onCreate={persistUrl}
			/>
		}
		return <DestinationView
			ip={ip}
			destination={{
				isRunning: proxyRunning,
				proxies,
				url,
			}}
			onToggleProxies={onToggleServer}
			performAction={performAction}
			onChangeURL={persistUrl}
		/>
	}
}

function onToggleServer() {
	performAction(()=>storage.status.toggle())
}

function persistUrl(url) {
	performAction(()=>storage.url.set(url))
}

function performAction(fn:()=>Promise<mixed>) {
	fn()
		.then(()=>location.reload())
		.catch(err => console.error(err.stack))
}
