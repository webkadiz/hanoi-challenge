const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const WriteFilePlugin = require("write-file-webpack-plugin")

module.exports = {
  entry: {
    "first-stage": "./src/first-stage/first-stage.js",
    "last-stage": "./src/last-stage/last-stage.js",
    timer: "./src/timer/timer.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist/",
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(sass|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(png|jpg|ttf|woff2|woff|eot|svg)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/first-stage/first-stage.html",
      filename: "first-stage.html",
      chunks: ["first-stage"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/last-stage/last-stage.html",
      filename: "last-stage.html",
      chunks: ["last-stage"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/timer/timer.html",
      filename: "timer.html",
      chunks: ["timer"],
    }),
    new CopyPlugin([{ from: "src/static", to: "static" }]),
    new WriteFilePlugin(),
  ],
  resolve: {
    alias: {
      "@": __dirname + "/src",
    },
  },
  devServer: {
    port: 8080,
  },
  devtool: "source-map",
}
