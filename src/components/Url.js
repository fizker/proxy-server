var React = require('react')

module.exports = React.createClass({ displayName: 'Url',
	propTypes: {
		url: React.PropTypes.string,
		onChangeUrl: React.PropTypes.func,
	},
	getInitialState: function() {
		return {
			url: null,
		}
	},
	render: function() {
		return <form onSubmit={this.onSubmit}>
			<input
				value={this.state.url || this.props.url || ''}
				onChange={this.onChange}
			/>
			<button disabled={this.state.url == null} type="button" onClick={()=>this.setState({ url: null })}>Reset</button>
			<button disabled={this.state.url == null}>Change url</button>
		</form>
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
