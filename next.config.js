const withPlugins = require('next-compose-plugins/lib')

function withNext() {
    return withPlugins([], {
        publicRuntimeConfig: {},
        webpack:(config)=>{
            return config;
        }
    })
}

module.exports = withNext()


