import {withDemo} from "./demo";

const apiOptions = {
    whitelist: ["/api/v1.0/industry/user/verify-login"],
    saveSessionApi: ["/api/v1.0/industry/user/verify-login"],
    removeSessionApi: [],
}

const csrfOptions = {
    whitelist:["/api/v1.0/community/steward/device/count/get"]
}

const redisOptions = {
    connectTimeout: 20000,
    lazyConnect: true,
    port: 6379,
    host: "localhost",
};

const sessionOptions = {
    prefix:"",
    key: "s-sid",// The client stores the corresponding cookie
    // rolling: true, // always reset the cookie and sessions
    ttl:24 * 60 * 60 * 1000, // redis survival time
    // full options: https://github.com/pillarjs/cookies#cookiesset-name--value---options--
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //one day in ms
        overwrite: true,
        signed: false
    }
}

const jaegerOptions = {
    endpoint: "http://localhost:14268/api/traces",
    serviceName: "next"
}

// const proxyOptions = {
//     path: /\/api\/.*/,
//     proxyTimeout: 10000,
//     timeout: 10000,
//     target: "https://baidu.com",
//     changeOrigin: true,
// }


module.exports = withDemo({assetPrefix: "", apiOptions, csrfOptions, redisOptions, sessionOptions, jaegerOptions})