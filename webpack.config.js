const path = require("path");

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
          options: {
            presets: ['react']
          }
        }
      }
    ]
  },
  plugins: [],
  devtool: "#source-map"
};

/**
 for production version, use ./node_modules/.bin/webpack -p
*/
