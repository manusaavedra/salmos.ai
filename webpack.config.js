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
    mode: 'none',
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
    },
    experiments: {
        asyncWebAssembly: true,
        buildHttp: true,
        layers: true,
        lazyCompilation: true,
        outputModule: true,
        syncWebAssembly: true,
        topLevelAwait: true,
    }
}

module.exports = (env, argv) => {
    
    if (argv.mode === 'production') {
        config.mode = 'production'
    }
    
    if (argv.mode === 'development') {
        config.mode = 'development'
        config.devtool = 'source-map'
    }
    
    return config
}
