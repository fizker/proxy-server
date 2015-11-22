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
			{ test: /\.jsx?$/, loader: 'babel-loader' },
		],
	},
	devtool: '#inline-source-map',
};
