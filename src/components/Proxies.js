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
				onChangeProxy={p=>this.onChangeProxy(proxy, p)}
				onDelete={()=>this.onDeleteProxy(proxy)}
				validateProxy={this.validateProxy}
			/>)}
			<Proxy
				onChangeProxy={this.onCreateProxy}
				validateProxy={this.validateProxy}
			/>
		</div>
	},

	validateProxy: function(old, proxy) {
		if(old && old.localPort == proxy.localPort) {
			return null
		}

		if(this.props.proxies.find(p => p.localPort == proxy.localPort)) {
			return 'Port-number is taken'
		}

		return null
	},

	onDeleteProxy: function(proxy) {
		this.props.performAction(()=>storage.proxies.delete(proxy))
	},
	onChangeProxy: function(old, proxy) {
		this.props.performAction(()=>storage.proxies.update(old, proxy))
	},
	onCreateProxy: function(proxy) {
		this.props.performAction(()=>storage.proxies.set(proxy))
	},
})
