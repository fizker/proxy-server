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
		})
	},
	render: function() {
		var data = this.props.data
		return <div>
			<Url url={data.url} onChangeUrl={persistUrl}/>
			<Proxies proxies={data.proxies} performAction={performAction}/>
		</div>
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
