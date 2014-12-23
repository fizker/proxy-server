var React = require('react')

var ProxyProp = require('../props/Proxy')

module.exports = React.createClass({ displayName: 'Proxies',
	propTypes: {
		proxy: ProxyProp,

		onChangeProxy: React.PropTypes.func,
		onDelete: React.PropTypes.func,
	},
	getInitialState: function() {
		var proxy = this.props.proxy || {}
		return {
			localPort: null,
			remotePort: null,
			showRemote: proxy.localPort != proxy.remotePort,
		}
	},
	render: function() {
		var proxy = this.props.proxy || {}
		return <form onSubmit={this.onSubmit}>
			<label>
				Local port:
				<input
					value={this.state.localPort || proxy.localPort}
					onChange={this.onChange.bind(null, 'localPort')}
				/>
			</label>
			<label>
				<input
					type="checkbox"
					checked={!this.state.showRemote}
					onChange={this.toggleShowRemote}
				/>
				Use same port for local and remote
			</label>
			{ this.state.showRemote &&
			<label>
				Remote port:
				<input
					value={this.state.remotePort || proxy.remotePort}
					onChange={this.onChange.bind(null, 'remotePort')}
				/>
			</label>
			}
			{this.props.onDelete &&
				<button type="button" onClick={this.props.onDelete}>Delete</button>
			}
			<button
				type="button"
				onClick={(e)=>{e.preventDefault();this.setState(this.getInitialState())}}
			>
				Revert
			</button>
			<button type="submit">Save</button>
		</form>
	},

	toggleShowRemote: function() {
		var newValue = !this.state.showRemote
		this.setState({ showRemote: newValue })

		if(newValue) {
			var proxy = this.props.proxy || {}
			this.setState({
				remotePort: this.state.localPort || proxy.localPort,
			})
		}
	},

	onChange: function(prop, e) {
		if(!this.props.onChangeProxy) return

		var val = e.target.value

		this.setState({
			[prop]: val
		})
	},

	onSubmit: function(e) {
		e.preventDefault()

		var proxy = this.props.proxy || {}
		var localPort = this.state.localPort || proxy.localPort
		var remotePort = this.state.remotePort || proxy.remotePort
		if(!this.state.showRemote) {
			remotePort = localPort
		}

		this.props.onChangeProxy && this.props.onChangeProxy({
			localPort,
			remotePort,
		})
	},
})
