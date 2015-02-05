var React = require('react')

var ProxyProp = require('../props/Proxy')

module.exports = React.createClass({ displayName: 'Proxies',
	propTypes: {
		proxy: ProxyProp,

		validateProxy: React.PropTypes.func,
		onChangeProxy: React.PropTypes.func,
		onDelete: React.PropTypes.func,
	},
	getInitialState: function() {
		return {
			localPort: null,
			remotePort: null,
		}
	},
	render: function() {
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
				onClick={(e)=>{e.preventDefault();this.setState(this.getInitialState())}}
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
			<div>{validation}</div>
		</form>
	},

	onChange: function(prop, e) {
		if(!this.props.onChangeProxy) return

		var val = +e.target.value || null

		let proxy = this.props.proxy || {}
		if(proxy[prop] == val) {
			val = null
		}

		this.setState({
			[prop]: val
		})
	},

	onSubmit: function(e) {
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

		if(this.props.validateProxy && this.props.validateProxy(this.props.proxy, result)) {
			return
		}

		var result = {
			localPort,
			remotePort,
		}

		this.props.onChangeProxy && this.props.onChangeProxy(result)
	},
})
