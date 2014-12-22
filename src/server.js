var express = require('express')
var path = require('path')

module.exports = function(options) {
	var app = express()

	app.use(express.static(path.join(__dirname, '../static')))

	app.get('/', function(req, res) {
		res.send(`<!doctype html>
			<title>Proxy server</title>
			<script type="application/json" id="data">
				${JSON.stringify({
					proxies: []
				})}
			</script>
			Loading…
			<script src="app.js"></script>
		`)
	})

	return new Promise(function(resolve, reject) {
		app.listen(options.port, function(err) {
			if(err) return reject(err)
			return resolve()
		})
	})
}
