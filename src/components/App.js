// @flow

import * as React from 'react'

import Url from './Url'
import Proxies from './Proxies'
import storage from '../storage/client'

import type { ClientData } from '../server'

type Props = {|
	data: ClientData,
|}

export default class App extends React.Component<Props> {
	render() {
		var data = this.props.data
		return <div>
			<button onClick={this.toggleServer}>{data.proxyRunning ? 'Turn off' : 'Turn on'}</button>
			<span>
				<span
					className={'running-indicator running-indicator--' + (data.proxyRunning ? 'on': 'off')}
				/>
				{data.proxyRunning ? 'Running' : 'Stopped'}
			</span>
			<Url url={data.url||''} onChangeUrl={persistUrl} ip={data.ip}/>
			<Proxies proxies={data.proxies} performAction={performAction}/>
		</div>
	}

	toggleServer = () => {
		performAction(()=>storage.status.toggle())
	}
}

function persistUrl(url) {
	performAction(()=>storage.url.set(url))
}

function performAction(fn) {
	fn()
		.then(()=>location.reload())
		.catch(err => console.error(err.stack))
}
