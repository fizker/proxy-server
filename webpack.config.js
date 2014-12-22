var path = require('path');

module.exports = {
	entry: './client.js',
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'app.js',
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.json'],
		alias: {
		},
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, loader: 'jsx-loader?harmony&stripTypes' },
			{ test: /\.json$/, loader: 'json' },
		],
	},
	devtool: '#inline-source-map',
};
