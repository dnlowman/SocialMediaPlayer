import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config = {
    context: path.resolve('./src'),
    entry: [
        './index'
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ],
    module: {
        loaders: [
            { test: /\.js$/, include: [/dashjs/, /src/], loader: "babel-loader" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] }
        ]
    }
};

export default config;
