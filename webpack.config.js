module.exports = {
    entry: "./data-transformer.js",
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
		    presets: ["es2015"]
		}
	    }
	]
    }
};
