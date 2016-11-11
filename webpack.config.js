var webpack = require("webpack");

module.exports = {
    entry: ["babel-polyfill", "./data-transformer.js"],
    devtool: "source-map",
    output: {
	filename: "./dist/data-transformer.js",
	libraryTarget: "umd"
    },
    module: {
	loaders: [
	    {
		test: /\.js$/,
		exclude: /node_modules/,
		loader: "babel",
		query: {
		    presets: ["es2015", "stage-0"]
		}
	    }
	]
    },
    plugins: [
	new webpack.optimize.UglifyJsPlugin({
	    compress: true,
	    comments: false,
	    beautify: false,
	    mangle: true
	})
    ]
};
