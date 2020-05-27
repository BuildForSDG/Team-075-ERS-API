const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebPackShellPlugin = require('webpack-shell-plugin');

module.exports = [
  {
    name: 'production',
    entry: path.resolve(__dirname, './src/server.js'),
    target: 'node',
    mode: 'production',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'server.bundle.js'
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js']
    }
  },
  {
    name: 'development',
    entry: path.resolve(__dirname, './src/server.js'),
    target: 'node',
    mode: process.env.NODE_ENV,
    watch: process.env.NODE_ENV === 'development',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'server.bundle.js'
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [
      new WebPackShellPlugin({
        onBuildEnd: ['npm run start:dev']
      })
    ]
  }];
