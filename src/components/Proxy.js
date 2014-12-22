var React = require('react')

var ProxyProp = require('../props/Proxy')

module.exports = React.createClass({ displayName: 'Proxies',
	propTypes: {
		proxy: ProxyProp,

		onChangeProxy: React.PropTypes.func,
		onDelete: React.PropTypes.func,
	},
	render: function() {
		var proxy = this.props.proxy || {}
		return <form onSubmit={this.onSubmit}>
			<label>
				Local port: <input value={proxy.port} ref="port"/>
			</label>
			<label>
				Remote url:
				<input value={proxy.url} ref="url"/>
			</label>
			{this.props.onDelete &&
				<button type="button" onClick={this.props.onDelete}>Delete</button>
			}
			<button type="reset">Revert</button>
			<button type="submit">Save</button>
		</form>
	},

	onSubmit: function(e) {
		e.preventDefault()
		this.props.onChangeProxy && this.props.onChangeProxy({
			url: this.refs.url.getDOMNode().value,
			port: this.refs.port.getDOMNode().value,
		})
	},
})
