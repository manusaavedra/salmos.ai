const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const {
    NODE_ENV = 'production',
} = process.env;

const rulesJs = {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
        presets: [
            [
                '@babel/preset-react',
                {
                    runtime: 'automatic'
                }
            ]
        ]
    }
}

const rulesCss = {
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader'
    ]
}

const config = {
    entry: __dirname + '/src',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.[contenthash].js'
    },   
    plugins: [
        new HtmlWebpackPlugin({template: __dirname + '/public/index.html'})
    ],
    module: {
        rules: [ rulesJs, rulesCss ]
    },
    devServer: {
        port: 3000,
        compress: true,
        open: true,
        historyApiFallback: true,
    },
    mode: 'development'
}

module.exports = config;
