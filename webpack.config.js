const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

const config = {
    devServer: {
        open: true,
        port: 9000
    },

    devtool: 'source-map',

    entry: {
        'css/main': './sass/main.jscss',
        'js/main': './src/main.ts',
        'js/demo/orbit': './src/demo/orbit.ts',
        'js/demo/two-body': './src/demo/two-body.ts',
        'js/demo/walking-sinus': './src/demo/walking-sinus.ts'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: {
                                safe: true
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            autoprefixer: {
                                browsers: ['last 2 versions']
                            },
                            plugins: () => [
                                autoprefixer
                            ]
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@apestaartje/animation': path.resolve(__dirname, 'src/lib/animation'),
            '@apestaartje/physics': path.resolve(__dirname, 'src/lib/physics'),
            app: path.resolve(__dirname, 'src'),
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/assets'),
        publicPath: '/assets/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            path: path.resolve(__dirname, 'public/assets')
        })
    ]
};

module.exports = config;
