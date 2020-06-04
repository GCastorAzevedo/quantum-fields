const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "development",
    entry: {
      main: "./src/index.js",
    },
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
      library: "app",
      libraryTarget: "umd",
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.pug$/,
          use: ["pug-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ["file-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.pug"),
        filename: path.resolve(__dirname, "index.html"),
        chunks: ["main"],
        locals: {
          mode: "development",
        },
      }),
      // new webpack.ProvidePlugin({
      //   d3: path.resolve(__dirname, "src", "d3.js"),
      // }),
    ],
  },
];
