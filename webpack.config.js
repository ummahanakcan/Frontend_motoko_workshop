const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    main: path.join(__dirname, "src", "street_animals_frontend", "src", "index.jsx")
  },
  output: {
    path: path.join(__dirname, "dist", "street_animals_frontend"),
    filename: "index.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    fallback: {}
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "street_animals_frontend", "src", "index.html"),
      filename: "index.html"
    }),
    new webpack.ProvidePlugin({
      process: "process/browser"
    })
  ]
};