module.exports = {
  entry: './src/main.jsx',
  // remove output to supply it from command line
  output: {path: __dirname + '/src', filename: 'bundle.js'},
  externals: {
    jquery: 'jQuery'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
