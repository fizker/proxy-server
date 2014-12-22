var React = require('react')

var ProxyProp = require('../props/Proxy')
var Proxy = require('./Proxy')

var storage = require('../storage/client')

module.exports = React.createClass({ displayName: 'Proxies',
	propTypes: {
		proxies: React.PropTypes.arrayOf(ProxyProp).isRequired,
		performAction: React.PropTypes.func.isRequired,
	},
	render: function() {
		return <div>
			<h1>Proxies</h1>
			{this.props.proxies.map(proxy => <Proxy
				proxy={proxy}
				onChangeProxy={p=>this.onChangeProxy(proxy.port, p)}
				onDelete={()=>this.onDeleteProxy(proxy.port)}
			/>)}
			<Proxy onChangeProxy={this.onCreateProxy} />
		</div>
	},

	onDeleteProxy: function(port) {
		this.props.performAction(()=>fajax.delete('/proxies/' + port))
	},
	onChangeProxy: function(port, proxy) {
		this.props.performAction(()=>storage.proxy.update(port, proxy))
	},
	onCreateProxy: function(proxy) {
		this.props.performAction(()=>storage.proxies.set(proxy))
	},
})
