const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },   
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            inject: 'body'
        })
    ],
    module: {
        rules: [ rulesJs, rulesCss ]
    }
}

module.exports = config;
