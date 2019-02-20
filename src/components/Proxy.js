// @flow

var React = require('react')

import type { Proxy } from '../storage/server'

function getInitialState() : State {
	return {
		localPort: null,
		remotePort: null,
	}
}

type Props = {|
	proxy?: Proxy,

	onChangeProxy?: (Proxy) => void,
	validateProxy?: (?Proxy, Proxy) => ?string,
	onDelete?: () => void,
|}

type State = {|
	localPort: ?number,
	remotePort: ?number,
|}

module.exports = class Proxies extends React.Component<Props, State> {
	state = getInitialState()

	render() {
		var proxy = this.props.proxy || {}
		// flowlint-next-line sketchy-null-number:warn
		var localPort = this.state.localPort || proxy.localPort || ''
		var remotePort = proxy.localPort == proxy.remotePort ? '' : proxy.remotePort
		if(this.state.remotePort != null) {
			remotePort = this.state.remotePort
		}
		let hasChanges = this.state.localPort != null || this.state.remotePort != null

		let validation = this.props.validateProxy && this.props.validateProxy(this.props.proxy, {
			localPort: localPort||0,
			remotePort: remotePort||0,
		})

		return <form onSubmit={this.onSubmit}>
			<label>
				Local port:
				<input
					value={localPort}
					onChange={this.onChange.bind(null, 'localPort')}
				/>
			</label>
			<label>
				Remote port:
				<input
					value={remotePort}
					onChange={this.onChange.bind(null, 'remotePort')}
					placeholder="Use local port"
				/>
			</label>
			{this.props.onDelete &&
				<button
					type="button"
					onClick={this.props.onDelete}
				>
					Delete
				</button>
			}
			<button
				type="button"
				onClick={(e)=>{e.preventDefault();this.setState(getInitialState())}}
				disabled={!hasChanges}
			>
				Revert
			</button>
			<button
				type="submit"
				disabled={!hasChanges || !!validation}
			>
				Save
			</button>
			<div className="validation">{validation}</div>
		</form>
	}

	onChange = (prop:'localPort'|'remotePort', e:SyntheticEvent<HTMLInputElement>) => {
		if(!this.props.onChangeProxy) return

		var val = +e.currentTarget.value || null

		let proxy = this.props.proxy || {}
		if(proxy[prop] == val) {
			val = null
		}

		this.setState({
			[prop]: val
		})
	}

	onSubmit = (e:SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()

		var proxy = this.props.proxy || {}
		// flowlint-next-line sketchy-null-number:warn
		var localPort = this.state.localPort || proxy.localPort
		var remotePort = this.state.remotePort
		if(remotePort == null || !Boolean(remotePort)) {
			if(Boolean(proxy.remotePort) && remotePort == null) {
				remotePort = proxy.remotePort
			} else {
				remotePort = localPort
			}
		}

		var result = {
			localPort,
			remotePort,
		}

		if(this.props.validateProxy && this.props.validateProxy(this.props.proxy, result)) {
			return
		}

		this.props.onChangeProxy && this.props.onChangeProxy(result)
	}
}
