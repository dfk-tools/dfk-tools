const { config } = require('dotenv');
const { resolve, join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { dependencies } = require('./package.json');

const { error, parsed } = config();
if (error) throw new Error(error);

const publicPath = resolve(__dirname, './public');
const srcPath = resolve(__dirname, './src');
const distPath = resolve(__dirname, './dist');

module.exports = ({ NODE_ENV }) => {
    const isProd = NODE_ENV === 'production';

    return {
        mode: NODE_ENV,
        target: 'web',
        entry: join(srcPath, 'index.tsx'),
        output: {
            filename: '[name].[chunkhash].js',
            path: distPath,
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.module.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    exclude: [/\.module.less$/],
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[contenthash].[ext]'
                    }
                }
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM'
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: publicPath, to: distPath }
                ]
            }),
            new DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
                'process.env.RPC_URL': JSON.stringify(parsed.RPC_URL)
            }),
            new NodePolyfillPlugin(),
            new HtmlPlugin({
                template: join(srcPath, 'index.ejs'),
                templateParameters: {
                    cdnReact: `https://unpkg.com/react@${dependencies['react'].match(/(\d+\.?)+/g)[0]}/umd/react${isProd ? '.production.min' : '.development'}.js`,
                    cdnReactDom: `https://unpkg.com/react-dom@${dependencies['react-dom'].match(/(\d+\.?)+/g)[0]}/umd/react-dom${isProd ? '.production.min' : '.development'}.js`,
                    cdnReactRouterDom: `https://unpkg.com/react-router-dom@${dependencies['react-router-dom'].match(/(\d+\.?)+/g)[0]}/umd/react-router-dom${isProd ? '.min' : ''}.js`
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css'
            })
        ],
        resolve: {
            extensions: ['.js', '.json', '.ts', '.tsx'],
            plugins: [
                new TsconfigPathsPlugin()
            ]
        },
        optimization: {
            minimizer: [
                new TerserPlugin()
            ],
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `vendor~${packageName.replace('@', '')}`;
                        },
                    }
                }
            },
        },
        devtool: 'source-map',
        devServer: {
            historyApiFallback: true,
            port: 3000
        }
    }
};
