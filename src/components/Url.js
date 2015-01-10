var React = require('react')
var urlModule = require('url')

module.exports = React.createClass({ displayName: 'Url',
	propTypes: {
		url: React.PropTypes.string,
		onChangeUrl: React.PropTypes.func,
		ip: React.PropTypes.string,
	},
	getInitialState: function() {
		return {
			url: null,
		}
	},
	render: function() {
		var url = this.getURL() || {}

		return <form onSubmit={this.onSubmit}>
			<input
				value={this.state.url || this.props.url || ''}
				onChange={this.onChange}
			/>
			<button
				disabled={this.state.url == null}
				type="button" onClick={()=>this.setState({ url: null })}
			>
				Reset
			</button>
			<button disabled={this.state.url == null}>Change url</button>
			{this.props.ip && <div>
				Your current ip: {this.props.ip}
				<button
					type="button"
					onClick={this.onUseIPClicked}
					disabled={url.host == this.props.ip}
				>
					Use this
				</button>
			</div>}
		</form>
	},

	getURL: function() {
		return urlModule.parse(this.state.url || this.props.url)
	},
	useIP: function() {
		var url = this.getURL()
		var newState
		if(url) {
			url.host = this.props.ip
			newState = urlModule.format(url).replace(/\/$/, '')
		} else {
			newState = 'http://' + this.props.ip
		}

		this.setState({ url: newState })
	},
	onUseIPClicked: function(e) {
		e.preventDefault()
		this.useIP()
	},
	onChange: function(e) {
		var newUrl = e.target.value
		if(newUrl == this.props.url) {
			newUrl = null
		}
		this.setState({ url: newUrl })
	},
	onSubmit: function(e) {
		e.preventDefault()

		var newUrl = this.state.url

		if(newUrl && !/^[a-z][a-z0-9_]+:\/\//.test(newUrl)) {
			newUrl = 'http://' + newUrl
		}

		if(this.props.onChangeUrl && newUrl != this.props.url) {
			this.props.onChangeUrl(newUrl)
		}
	},
})
