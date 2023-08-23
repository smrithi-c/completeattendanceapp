const path = require('path');

module.exports = {
  entry: './server.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      fs: false,
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url/'),
    },
  },
};
