import { middleware as apiMiddleware, Options as ApiOpitons } from "./api";
import { middleware as csrfMiddleware } from "../src/middlewares/csrf";
import { middleware as jaegerMiddleware } from "../src/middlewares/jaeger";
import { middleware as redisMiddleware, KoaRedis } from "../src/middlewares/redis";
import { middleware as routerMiddleware } from "../src/middlewares/router";
import { middleware as proxyMiddleware, Options as ProxyOptons} from "../src/middlewares/proxy";

interface JaegerOptions {
    endpoint: string;
    serviceName: string;
}

interface CsrfOptions {
    whitelist: string[];
}

interface ApiConfig {
    assetPrefix?: string
    jaegerOptions: JaegerOptions
    csrfOptions: CsrfOptions
    redisOptions: KoaRedis["redisOptions"]
    sessionOptions: KoaRedis["sessionOptions"]
    apiOptions?: ApiOpitons
    proxyOptions?: ProxyOptons
    [other: string]: any
}

export const withDemo = (config: ApiConfig)=> {
    const {assetPrefix="", jaegerOptions, csrfOptions, redisOptions, sessionOptions, apiOptions, proxyOptions, ...restConfig} = config;
    const appMiddlewares = [routerMiddleware(), jaegerMiddleware(jaegerOptions), csrfMiddleware(csrfOptions), redisMiddleware({redisOptions, sessionOptions}), proxyMiddleware(proxyOptions)]
    return {
        assetPrefix,
        middlewares: [...appMiddlewares, apiMiddleware(apiOptions)],
        ...restConfig
    }
}

