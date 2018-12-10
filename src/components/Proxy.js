var React = require('react')

//var ProxyProp = require('../props/Proxy')

function getInitialState() {
	return {
		localPort: null,
		remotePort: null,
	}
}

module.exports = class Proxies extends React.Component {
//	propTypes: {
//		proxy: ProxyProp,
//
//		validateProxy: React.PropTypes.func,
//		onChangeProxy: React.PropTypes.func,
//		onDelete: React.PropTypes.func,
//	},
	state = getInitialState()

	render() {
		var proxy = this.props.proxy || {}
		var localPort = this.state.localPort || proxy.localPort || ''
		var remotePort = proxy.localPort == proxy.remotePort ? '' : proxy.remotePort
		if(this.state.remotePort != null) {
			remotePort = this.state.remotePort
		}
		let hasChanges = this.state.localPort != null || this.state.remotePort != null

		let validation = this.props.validateProxy && this.props.validateProxy(this.props.proxy, {
			localPort, remotePort
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

	onChange = (prop, e) => {
		if(!this.props.onChangeProxy) return

		var val = +e.target.value || null

		let proxy = this.props.proxy || {}
		if(proxy[prop] == val) {
			val = null
		}

		this.setState({
			[prop]: val
		})
	}

	onSubmit = (e) => {
		e.preventDefault()

		var proxy = this.props.proxy || {}
		var localPort = this.state.localPort || proxy.localPort
		var remotePort = this.state.remotePort
		if(!remotePort) {
			if(proxy.remotePort && remotePort == null) {
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
