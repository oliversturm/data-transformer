var webpack = require("webpack");

module.exports = [
    {
	entry: "./data-transformer.js",
	output: {
	    filename: "./dist/data-transformer-browser.js",
	    library: "dataTransformer",
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
		compress: false,
		comments: false,
		beautify: true,
		mangle: false
	    })
	]
    },
    {
	entry: "./data-transformer.js",
	output: {
	    filename: "./dist/data-transformer-browser.min.js",
	    library: "dataTransformer",
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
    }
];

