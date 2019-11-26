var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    plugins: [
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: devMode ? '[name].css' : '[name].[hash].css',
          chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
      ],
      module: {
        rules: [
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: process.env.NODE_ENV === 'development',
                },
              },
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.js$/,
            use: [
                {
                    loader:'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        },

        ],
      },
};