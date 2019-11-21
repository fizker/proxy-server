// @flow

import * as React from 'react'

import type { Proxy, AnyReturnValue } from '../storage/server'

function getInitialState() : State {
	return {
		localPort: null,
		remotePort: null,
	}
}

type Props = {|
	validateProxy: (Proxy) => ?string,
	onChangeProxy: (Proxy) => AnyReturnValue,

	url: string,
	proxy?: Proxy,
	onDelete?: () => AnyReturnValue,
|}

type State = {|
	localPort: ?string,
	remotePort: ?string,
|}

export default class Proxies extends React.Component<Props, State> {
	state = getInitialState()

	render() {
		const { url } = this.props
		const proxy = this.props.proxy || {}

		const localPort = this.state.localPort == null ? proxy.localPort || '' : this.state.localPort
		const remotePort = this.state.remotePort == null
			? proxy.localPort == proxy.remotePort ? '' : proxy.remotePort
			: this.state.remotePort

		const isSaveable = Boolean(+this.state.localPort) ||
			(
				this.state.remotePort === '' ||
				Boolean(+this.state.remotePort)
			)

		const validation = this.props.validateProxy && this.props.validateProxy({
			url,
			localPort: +localPort,
			remotePort: +remotePort,
		})

		return <form onSubmit={this.onSubmit}>
			<label>
				Local port:
				<input
					value={localPort}
					onChange={this.onChangeLocalPort}
				/>
			</label>
			<label>
				Remote port:
				<input
					value={remotePort}
					onChange={this.onChangeRemotePort}
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
				onClick={(e)=>{
					e.preventDefault()
					this.setState(getInitialState())
				}}
				disabled={!isSaveable}
			>
				Revert
			</button>
			<button
				type="submit"
				disabled={!isSaveable || !!validation}
			>
				Save
			</button>
			<div className="validation">{validation}</div>
		</form>
	}

	onChangeLocalPort = (e:SyntheticEvent<HTMLInputElement>) => {
		let val = e.currentTarget.value

		const proxy = this.props.proxy
		if(proxy && proxy.localPort.toString() === val) {
			val = null
		}

		this.setState({
			localPort: val
		})
	}

	onChangeRemotePort = (e:SyntheticEvent<HTMLInputElement>) => {
		let val = e.currentTarget.value

		const proxy = this.props.proxy
		if(proxy != null) {
			if(proxy.remotePort.toString() === val) {
				val = null
			}
			if(val === '' && proxy.localPort === proxy.remotePort) {
				val = null
			}
		}

		this.setState({
			remotePort: val
		})
	}

	onSubmit = (e:SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { url } = this.props
		var proxy = this.props.proxy || {}
		const localPort = this.state.localPort == null ? proxy.localPort : +this.state.localPort
		const remotePort = this.state.remotePort == null
			? (proxy.remotePort == null
			? localPort
			: proxy.remotePort
			)
			: this.state.remotePort === '' ? localPort : +this.state.remotePort

		var result = {
			url,
			localPort,
			remotePort,
		}

		if(this.props.validateProxy && this.props.validateProxy(result)) {
			return
		}

		this.props.onChangeProxy && this.props.onChangeProxy(result)
	}
}
