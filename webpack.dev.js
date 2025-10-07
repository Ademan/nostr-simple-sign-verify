const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		'main': './src/main.js',
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname + 'dist'),
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		port: 5000,
		open: true,
	},
};
