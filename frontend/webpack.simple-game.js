const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = {
  entry: "./src/first-stage/first-stage.js",
  output: {
    path: path.resolve(__dirname, "../simple-game"),
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
        test: /\.(ttf|woff2|woff|eot)$/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]",
        },
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[ext]",
            },
          },
          "image-webpack-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/first-stage/first-stage.html",
      filename: "index.html",
    }),
  ],
  resolve: {
    alias: {
      "@": __dirname + "/src",
    },
  },
  mode: "production",
}
