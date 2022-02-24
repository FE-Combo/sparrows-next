
import {ParameterizedContext,DefaultState, DefaultContext, Next} from "koa";
import { createProxyMiddleware, Options as ProxyOptions } from 'http-proxy-middleware'
import c2k from 'koa-connect'
import {match} from "path-to-regexp";
import {IncomingMessage, ServerResponse} from "http"

export interface Options extends ProxyOptions {
    path: string | RegExp | (string | RegExp)[],
}

type ConnectMiddleware = (req: IncomingMessage, res: ServerResponse, callback: (...args: unknown[]) => void) => void

export interface ProxyCTX  extends DefaultContext{
    proxy: {
        options?: Options
    }
}

export const middleware = (options?: Options) => async ( ctx: ParameterizedContext<DefaultState, ProxyCTX>, next: Next) => {
    if(options && match(options.path, { decode: decodeURIComponent })(ctx.path)) {
        const {path, ...restOptions} = options
        await c2k(createProxyMiddleware(restOptions || {}) as ConnectMiddleware)(ctx, next)
    } else {
        await next();
    }
}
