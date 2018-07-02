var webpack = require("webpack");
var CompressionPlugin = require("compression-webpack-plugin");
var path = require("path");

var lib_dir = __dirname + "/_rsc/vendors",
  node_dir = __dirname + "/node_modules";

module.exports = {
  entry: {
    app: ["./src/app.jsx"]
  },
  output: {
    path: path.join(__dirname, "_rsc/js_build"),
    filename: "./[name].bundle.js"
  },

  module: {
    rules: [
       {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          options: {presets: ['react', "env"]}
          }
        }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   output: {
    //     comments: false,
    //   },
    // }),
    new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    inline: false,
    uglifyOptions: { ecma: 8,
      compress: {
           dead_code: true,
           global_defs: {
                    'process.env.NODE_ENV': JSON.stringify('production')
            }
       } }
  }),

  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};

/**
 for production version, use ./node_modules/.bin/webpack --config webpack-prod.config.js -p

 seeing this error, but doesn't effect bundle
 ERROR in ./app.bundle.js from UglifyJs
Invalid assignment [./app.bundle.js:39363,30]
has to do with webpack uglify not able to handle ES2015 code
*/
