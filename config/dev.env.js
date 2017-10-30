'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// 生产环境的配置会 merge prod的配置，只有生产环境特有的配置写在这里
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://118.89.221.56:99/api"',
})
