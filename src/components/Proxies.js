var React = require('react')

var ProxyProp = require('../props/Proxy')
var Proxy = require('./Proxy')

var fajax = require('fajax')

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
				onDelete={()=>this.onDeleteProxy(proxy.port)}
			/>)}
			<Proxy onChangeProxy={this.onCreateProxy} />
		</div>
	},

	onDeleteProxy: function(port) {
		fajax.delete('/proxies/' + port)
			.then(()=>location.reload())
			.done()
	},
	onChangeProxy: function(port, proxy) {
		var promies = [fajax.put('/proxies/' + proxy.port, { json: proxy })]
		if(port != proxy.port) {
			promises.push(fajax.delete('/proxies/' + port))
		}

		Promise.all(promises)
			.then(()=>location.reload())
			.done()
	},
	onCreateProxy: function(proxy) {
		fajax.put('/proxies/' + proxy.port, { json: proxy })
			.then(()=>location.reload())
			.done()
	},
})
