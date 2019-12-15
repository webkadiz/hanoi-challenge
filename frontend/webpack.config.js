const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/dist/'
	},

	module: {
		rules: [
			{
		      test: /\.m?js$/,
		      exclude: /(node_modules|bower_components)/,
		      use: {
		        loader: 'babel-loader',
		        options: {
		          presets: ['@babel/preset-env'],
		          plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread']
		        }
		      }
		    },
			{
				test: /\.(sass|scss)$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.html$/,
				use: ['html-loader']
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
	resolve: {
		alias: {
			'@modules': __dirname + '/src/modules'
		}
	},
	devServer: {
		port: 8080
	},
	devtool: 'source-map'
}