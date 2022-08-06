const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

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

const rulesImages = {
    test: /\.(jpg|png)$/,
    use: {
        loader: 'file-loader',
        loader: 'url-loader',
    }
}

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Salmos.ai - un reproductor remoto de canciones',
            template: path.resolve(__dirname, 'public/index.html'),
            inject: 'body',
        }),
        new CompressionPlugin({
            test: /\.js$|\.css$|\.html$/,
            threshold: 0,
            minRatio: 0.8
        })
    ],
    module: {
        rules: [rulesJs, rulesCss, rulesImages]
    }
};

