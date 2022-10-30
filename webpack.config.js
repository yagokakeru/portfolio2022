const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/ts/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js', '.scss'],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        open: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(jpe?g|png|webp|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                }
            },
            {
                test: /\.(mp4)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'video/[name][ext]',
                }
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.(glsl|vert|frag)$/,
                use: 'ts-shader-loader'
                // exclude: '/node_modules/',
                // use: [
                //     'raw-loader',
                //     'glslify-loader'
                // ]
                // type: 'asset/source',
                // generator: {
                //     filename: 'shaders/[name][ext]',
                // },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            minify: {
                removeRedundantAttributes: false,
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
}