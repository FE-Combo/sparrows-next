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
    publicRuntimeConfig: {},
    webpack:(config)=>{
        return config;
    }
})


