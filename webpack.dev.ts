// tslint:disable:object-literal-sort-keys
import * as HtmlWebPackPlugin from "html-webpack-plugin";
import * as webpack from "webpack";

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html"
});

const config: webpack.Configuration = {
  mode: "development",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: "awesome-typescript-loader" },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: "style-loader" // inject CSS to page
          },
          {
            loader: "css-loader" // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run postcss actions
            options: {
              plugins() {
                // postcss plugins, can be exported to postcss.config.js
                return [require("autoprefixer")];
              }
            }
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      }
    ]
  },
  plugins: [htmlPlugin]
};

export default config;
