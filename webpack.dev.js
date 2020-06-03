const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "production",
    entry: {
      main: "./src/components/densityPlots/index.js",
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
        template: path.resolve(__dirname, "public/views/index.pug"),
        filename: path.resolve(__dirname, "index.html"),
        chunks: ["main"],
        locals: {
          mode: "production",
        },
      }),
      new webpack.ProvidePlugin({
        d3: path.resolve(__dirname, "src", "d3.js"),
      }),
    ],
  },
];
