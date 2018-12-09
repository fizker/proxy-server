var path = require('path');

module.exports = {
	mode: process.NODE_ENV === 'production' ? 'production' : 'development',
	entry: './client.js',
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'app.js',
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.js', '.json'],
		alias: {
		},
	},
	module: {
		rules: [
			{ test: /\.jsx?$/, loader: 'babel-loader' },
		],
	},
	devtool: '#inline-source-map',
};
