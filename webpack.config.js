const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')


const modeProd = process.env.NODE_ENV === 'prod'


const base = {
  context: __dirname,
  entry: {
    logic: './src/app',
  },
  output: {
    path: path.join(__dirname, '/public/js'),
    filename: '[name].js',
    library: '[name]',
  },
  resolve: {
    moduleExtensions: ['.', './node_modules'],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
          plugins: [
            'transform-class-properties',
            'transform-object-rest-spread',
            'lodash',
          ],
        },
      },
    ],
  }
}

const dev = {
  watch: true,
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/dev/',
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 500,
      ignored: /node_modules/,
    },
    historyApiFallback: {
      from: /\/\w/,
      to: '/',
    },
    compress: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 3000,
  },
}

const prod = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new UglifyJSPlugin({
      compress: {
        warnings: false,
        // drop_console: true,
      },
    }),
  ]
}

const webpackConfig = modeProd
  ? merge(base, prod)
  : merge(base, dev)


module.exports = webpackConfig
