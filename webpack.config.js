module.exports = {
  cache: true,
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: /src/,
        loader: '6to5-loader',
        query: {modules: 'common'}
      },
      {
        test: /\.tag$/,
        include: /src/,
        loader: 'tag'
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
