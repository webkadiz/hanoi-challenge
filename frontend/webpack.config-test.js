var nodeExternals = require("webpack-node-externals")

module.exports = {
  output: {
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]",
  },
  resolve: {
    alias: {
      "@": __dirname + "/src",
    },
  },
  devtool: "inline-cheap-module-source-map",
  target: "node", // webpack should compile node compatible code
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder,
  mode: "development",
}
