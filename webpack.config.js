const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => {

    const isDevBuild = !env.production;
    const bundleOutputDir = env.bundleOutputDir;
    const templateInjectBefore  = env.templateInjectBefore;
    const templateFileName = env.templateFileName || 'index.html';

    const apiHost = env.apiHost || 'localhost';
    const apiPort = env.apiPort ? Number(env.apiPort) : 3000;

    const apiProtocol = env.apiProtocol || 'http';
    const apiUrl = `${apiProtocol}://${apiHost}:${apiPort}/api`;
    console.info(`Using api: ${apiUrl}`);

    if (!(bundleOutputDir && String(bundleOutputDir))) {
        throw new Error(`
            Invalid bundle output dir.
            Ensure the parameter --env.bundleOutputDir is set.
            Expected string but "${bundleOutputDir}" is given.
        `)
    }

    return [{
        devServer: {
            historyApiFallback: {
                index: "/"
            }
        },
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        entry: { 'main': './src/index.tsx' },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: '/'
        },
        module: {
            rules: [
                { test: /\.tsx?$/, loader: 'tslint-loader', enforce: 'pre', options: { emitErrors: isDevBuild } },
                { test: /\.tsx?$/, use: 'ts-loader?silent=true' },
                {
                    test: /\.scss$/,
                    test: /\.s?css$/,
                    use: [
                        isDevBuild
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                      ],
                },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                { test: /\.(woff2?|svg|ttf)$/, use: 'file-loader', exclude: __dirname + '/src/assets/images' }
            ]
        },
        plugins: 
            [
                new webpack.DefinePlugin({
                    API_URL: JSON.stringify(apiUrl),
                }),
                new MiniCssExtractPlugin({
                    filename: isDevBuild ? '[name].css' : '[name].[hash].css',
                    chunkFilename: isDevBuild ? '[id].css' : '[id].[hash].css',
                }),
                new HtmlWebpackPlugin({
                    filename: templateFileName,
                    template: 'index.html',
                    favicon: 'favicon.ico',
                    templateParameters: {
                        templateInjectBefore
                    }
                }),
                new CleanWebpackPlugin([bundleOutputDir], { allowExternal: true } ),
            ].concat(
                isDevBuild ? [
                    new webpack.SourceMapDevToolPlugin({
                        filename: '[file].map',
                        moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]')
                    })
                ] : []
            )
    }];
};
