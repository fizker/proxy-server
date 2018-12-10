var settings = require('./src/settings')
var server = require('./src/server')

if(require.main != module) {
	// Included from tests or other node.js modules
	module.exports = {
		open: server,
		settings: settings,
	}
	return
}

var PORT = process.env.PORT || 8088

settings.port = PORT
settings.storage = __dirname + '/data.json'

server({
	port: PORT
})
	.then(function() {
		console.log('Server running at ' + PORT)
	})
	.catch(e => console.error(e.stack || e.message))
