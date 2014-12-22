var React = require('react')

module.exports = React.PropTypes.shape({
	url: React.PropTypes.string.isRequired,
	port: React.PropTypes.number.isRequired,
})
