module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      minimize: true,
    },
    output: {
      filename: '[name].min.js',
    },
  },
  css: {
    extract: true,
  }
};
