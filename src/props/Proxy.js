var React = require('react')

module.exports = React.PropTypes.shape({
	remotePort: React.PropTypes.number.isRequired,
	localPort: React.PropTypes.number.isRequired,
})
