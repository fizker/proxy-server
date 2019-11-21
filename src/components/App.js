// @flow

import * as React from 'react'

import CreateDestinationView from './CreateDestinationView'
import DestinationView from './DestinationView'
import storage from '../storage/client'
import { createDestinationsForProxies } from '../transforms/destination'

import type { ClientData } from '../server'
import type { Proxy } from '../storage/server'

type Props = $ReadOnly<{|
	data: ClientData,
|}>

type State = $ReadOnly<{|
	newDestinationURL: ?string
|}>

function HR() {
	return <hr style={{ margin: "20px 0" }} />
}

export default class App extends React.Component<Props, State> {
	state = {
		newDestinationURL: null,
	}
	render() {
		const { data: { proxies, proxyRunning, ip } } = this.props
		const { newDestinationURL } = this.state
		const destinations = createDestinationsForProxies(proxies)

		return <div>
			{destinations.map(dest => <React.Fragment key={dest.url}>
				<DestinationView
					ip={ip}
					destination={dest}
					onDeleteDestination={() => dest.proxies.forEach(onDeleteProxy)}

					onDeleteProxy={onDeleteProxy}
					onUpdateProxy={onUpdateProxy}
					onCreateProxy={onCreateProxy}
					onToggleProxy={onToggleServer}
					validateProxy={(old, newProxy) => validateProxy(proxies, old, newProxy)}
				/>
				<HR />
			</React.Fragment>)}

			{ newDestinationURL == null
			? <CreateDestinationView
				onCreate={url => this.setState({ newDestinationURL: url })}
			/>
			: <DestinationView
				ip={ip}
				destination={{
					url: newDestinationURL,
					proxies: [],
					isRunning: false,
				}}
				onDeleteDestination={() => this.setState({ newDestinationURL: null })}

				onDeleteProxy={onDeleteProxy}
				onUpdateProxy={onUpdateProxy}
				onCreateProxy={onCreateProxy}
				onToggleProxy={onToggleServer}
				validateProxy={(old, newProxy) => validateProxy(proxies, old, newProxy)}
			/> }
		</div>
	}
}

function onDeleteProxy(proxy:Proxy) : void {
	performAction(()=>storage.proxies.delete(proxy))
}
function onUpdateProxy(old:Proxy, proxy:Proxy) : void {
	performAction(()=>storage.proxies.update(old, proxy))
}
function onCreateProxy(proxy:Proxy) : void {
	performAction(()=>storage.proxies.set(proxy))
}
function onToggleServer(proxy:Proxy) {
	performAction(()=>storage.status.toggle())
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

function performAction(fn:()=>Promise<mixed>) {
	fn()
		.then(()=>location.reload())
		.catch(err => console.error(err.stack))
}
