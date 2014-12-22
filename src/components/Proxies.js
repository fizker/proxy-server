var React = require('react')

var ProxyProp = require('../props/Proxy')
var Proxy = require('./Proxy')

module.exports = React.createClass({ displayName: 'Proxies',
	propTypes: {
		proxies: React.PropTypes.arrayOf(ProxyProp).isRequired,
	},
	render: function() {
		return <div>
			<h1>Proxies</h1>
			{this.props.proxies.map(proxy => <Proxy
				proxy={proxy}
				onChangeProxy={p=>this.onChangeProxy(proxy.port, p)}
			/>)}
			<Proxy onChangeProxy={this.onCreateProxy} />
		</div>
	},

	onDeleteProxy: function(port) {},
	onChangeProxy: function(port, proxy) {},
	onCreateProxy: function(proxy) {},
})