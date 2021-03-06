const path = require('path')
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry:[
      './src/index.js'  
    ],
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        publicPath: 'build/'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                exclude: /(node_modules)/,
                test: /\.js$/
            }
        ]
    }

}
