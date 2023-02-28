import { middleware as apiMiddleware, Options as ApiOpitons } from "./api";
import { middleware as csrfMiddleware } from "sparrows/dist/middlewares/csrf";
import { middleware as jaegerMiddleware } from "sparrows/dist/middlewares/jaeger";
import {
  middleware as redisMiddleware,
  KoaRedis,
} from "sparrows/dist/middlewares/redis";
import { middleware as corsMiddleware } from "sparrows/dist/middlewares/cors";
import {
  middleware as proxyMiddleware,
  Options as ProxyOptons,
} from "sparrows/dist/middlewares/proxy";
import { middleware as errorMiddleware } from "sparrows/dist/middlewares/error";
import { middleware as appMiddleware } from "../src/middlewares/app";
import bodyparser from "koa-bodyparser";

interface JaegerOptions {
  endpoint: string;
  serviceName: string;
}

interface CsrfOptions {
  whitelist: string[];
}

interface ApiConfig {
  jaegerOptions: JaegerOptions;
  csrfOptions: CsrfOptions;
  redisOptions: KoaRedis["redisOptions"];
  sessionOptions: KoaRedis["sessionOptions"];
  apiOptions?: ApiOpitons;
  proxyOptions?: ProxyOptons;
  // eslint-disable-next-line
  [other: string]: any;
}

export const withDemo = (config: ApiConfig) => {
  const {
    jaegerOptions,
    csrfOptions,
    redisOptions,
    sessionOptions,
    apiOptions,
    proxyOptions,
    ...restConfig
  } = config;

  const nextMiddlewares = [
    proxyMiddleware(proxyOptions),
    bodyparser(),
    jaegerMiddleware(jaegerOptions),
    csrfMiddleware(csrfOptions),
    redisMiddleware({ redisOptions, sessionOptions }),
    apiMiddleware(apiOptions),
  ];

  const appMiddlewareOptions = {
    whitelist: ["/", "/login", "/home"],
    staticlist: ["/icons/(.*)"],
    redirectRoute: "/login",
    apiMiddlewares: nextMiddlewares,
    pageMiddlewares: nextMiddlewares,
  };
  const middlewares = [
    errorMiddleware(),
    corsMiddleware(),
    appMiddleware(appMiddlewareOptions),
  ];
  return {
    middlewares,
    ...restConfig,
  };
};
