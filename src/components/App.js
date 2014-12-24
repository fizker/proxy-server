var React = require('react')

var Url = require('./Url')
var Proxies = require('./Proxies')

var ProxyProp = require('../props/Proxy')

var storage = require('../storage/client')

module.exports = React.createClass({ displayName: 'App',
	propTypes: {
		data: React.PropTypes.shape({
			url: React.PropTypes.string,
			proxies: React.PropTypes.arrayOf(ProxyProp).isRequired,
			proxyRunning: React.PropTypes.bool,
		})
	},
	render: function() {
		var data = this.props.data
		return <div>
			<button onClick={this.toggleServer}>{data.proxyRunning ? 'Off' : 'On'}</button>
			<Url url={data.url} onChangeUrl={persistUrl}/>
			<Proxies proxies={data.proxies} performAction={performAction}/>
		</div>
	},

	toggleServer: function() {
		performAction(()=>storage.status.toggle())
	},
})

function persistUrl(url) {
	performAction(()=>storage.url.set(url))
}

function performAction(fn) {
	fn()
		.then(()=>location.reload())
		.done()
}
