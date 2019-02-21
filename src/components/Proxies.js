// @flow

var React = require('react')

var ProxyView = require('./Proxy')
var storage = require('../storage/client')

import type { Proxy } from '../storage/server'

type Props = {|
	proxies: $ReadOnlyArray<Proxy>,
	performAction: (()=>Promise<mixed>) => void,
|}

module.exports = class Proxies extends React.Component<Props> {
	render() {
		return <div>
			<h1>Proxies</h1>
			{this.props.proxies.map(proxy => <ProxyView
				key={proxy.localPort}
				proxy={proxy}
				onChangeProxy={p=>this.onChangeProxy(proxy, p)}
				onDelete={()=>this.onDeleteProxy(proxy)}
				validateProxy={this.validateProxy}
			/>)}
			<ProxyView
				onChangeProxy={this.onCreateProxy}
				validateProxy={this.validateProxy}
			/>
		</div>
	}

	validateProxy = (old:?Proxy, proxy:Proxy) : ?string => {
		if(old && old.localPort == proxy.localPort) {
			return null
		}

		if(this.props.proxies.find(p => p.localPort == proxy.localPort)) {
			return 'Port-number is taken'
		}

		return null
	}

	onDeleteProxy = (proxy:Proxy) : void => {
		this.props.performAction(()=>storage.proxies.delete(proxy))
	}
	onChangeProxy = (old:Proxy, proxy:Proxy) : void => {
		this.props.performAction(()=>storage.proxies.update(old, proxy))
	}
	onCreateProxy = (proxy:Proxy) : void => {
		this.props.performAction(()=>storage.proxies.set(proxy))
	}
}
