const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		'first-stage': './src/first-stage/first-stage.js',
		'last-stage': './src/last-stage/last-stage.js'
	},
	output: {
		filename: '[name].js',
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
			template: './src/first-stage/first-stage.html',
			filename: 'first-stage.html',
			chunks: ['first-stage']
		}),
		new HtmlWebpackPlugin({
			template: './src/last-stage/last-stage.html',
			filename: 'last-stage.html',
			chunks: ['last-stage']
		})
	],
	resolve: {
		alias: {
			'@': __dirname + '/src'
		}
	},
	devServer: {
		port: 8080
	},
	devtool: 'source-map'
}