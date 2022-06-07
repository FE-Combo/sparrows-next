const withPlugins = require('next-compose-plugins/lib')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPlugins([
    [withPWA, {
        pwa: {
            dest: 'public',
            runtimeCaching,
            disable: process.env.NODE_ENV !== 'production'
        }
    }]
], {
    assetPrefix:"",
    publicRuntimeConfig: {},
    webpack:(config) => {
        return config;
    }
})



// 京东微应用 => 子应用配置
// const isProduction = process.env.NODE_ENV === 'production'

// // 每个主应用的baseroute都是不同的，根据 BASE_ROUTE 动态设置baseroute的值
// const baseRoute = process.env.BASE_ROUTE || '/app-nextjs11'
// // 根据baseroute设置资源前缀
// const assetPrefix = isProduction ? `http://www.micro-zoe.com:${process.env.PORT}${baseRoute}` : `http://localhost:${process.env.PORT}${baseRoute}`

// /** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
//   // 编译静态文件加上前缀
//   basePath: baseRoute,
//   // 读取静态文件加上前缀
//   assetPrefix,
//   // 添加 assetPrefix 地址到 publicRuntimeConfig
//   publicRuntimeConfig: {
//     assetPrefix,
//   },
//   // 为不同的主应用构建单独的包

//   webpack: (config) => {
//     Object.assign(config.output, {
//       chunkLoadingGlobal: 'webpackJsonp_child_nextjs11', // webpack5
//       // jsonpFunction: 'webpackJsonp_child_nextjs11', // webpack4
//       globalObject: 'window',
//     })
//     return config
//   },
// }
