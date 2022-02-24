import {Next,ParameterizedContext, DefaultState} from "koa";
import {match} from "path-to-regexp";
import {saveSession, removeSession, RedisCTX} from "../src/middlewares/redis";
import {CsrfCTX} from "../src/middlewares/csrf"
import {JaegerCTX, createSubSpan} from "../src/middlewares/jaeger"
import {ProxyCTX} from "../src/middlewares/proxy";
import bodyparser from "koa-bodyparser";
import { FORMAT_HTTP_HEADERS} from 'opentracing';

export interface Options {
    whitelist?: string[];
    saveSessionApi?: string[];
    removeSessionApi?: string[]
}

export interface ApiCTX extends RedisCTX, CsrfCTX, JaegerCTX, ProxyCTX {
    api: Options
}

export const middleware = (options?: Options) => async (ctx: ParameterizedContext<DefaultState, ApiCTX>, next: Next) => {
    createExistMiddlewaresLogs(ctx)
    const span = createSubSpan("api", ctx)
    ctx.jaeger.jaeger.inject(span, FORMAT_HTTP_HEADERS, ctx.req.headers);
    await bodyparser()(ctx,next);
    if(options) {
        ctx.api = options;
        if(/\/api\/.*/.test(ctx.path)) {
            span.setTag("api", true)
            const {whitelist=[], saveSessionApi=[], removeSessionApi=[]} = options || {}
            span.setTag("path", ctx.path)
            span.setTag("options", JSON.stringify(options))
            const matchWhitelistUrl = whitelist?.length > 0 ? match(whitelist, { decode: decodeURIComponent }) : undefined;
            const matchSaveSessionUrl = saveSessionApi?.length > 0 ? match(saveSessionApi, { decode: decodeURIComponent }) : undefined;
            const matchremoveSessionUrl = removeSessionApi?.length> 0 ? match(removeSessionApi, { decode: decodeURIComponent }) : undefined;
            if(matchWhitelistUrl && matchWhitelistUrl(ctx.path)) {
                if(matchSaveSessionUrl && matchSaveSessionUrl(ctx.path)) {
                    span.setTag("info", "save session");
                    await saveSession({test: "test"}, ctx)
                } else {
                    span.setTag("info", "unauth normal");
                }
            } else {
                if(matchremoveSessionUrl && matchremoveSessionUrl(ctx.path)) {
                    span.setTag("info", "remove session");
                    await removeSession(ctx);
                } else {
                    span.setTag("info", "auth normal");
                } 
            }
        } else {
            span.setTag("route", true)
        }     
    }
   
    span.finish();
}

function createExistMiddlewaresLogs(ctx: ParameterizedContext<DefaultState, ApiCTX>) {
    if(ctx.jaeger) {
        if(ctx.csrf) {
            const {whitelist, key} = ctx.csrf
            const span = createSubSpan("csrf", ctx)
            span.setTag("whitelist",whitelist)
            span.setTag("key",key)
            span.finish();
        }
        if(ctx.redis) {
            const {redisOptions, sessionOptions} = ctx.redis
            const span = createSubSpan("redis", ctx);
            span.setTag("host", redisOptions.host)
            span.setTag("port", redisOptions.port)
            span.setTag("sessionOptions",sessionOptions)
            span.finish(); 
        }
        if(ctx.proxy) {
            const {options} = ctx.proxy
            const span = createSubSpan("proxy", ctx);
            span.setTag("options", options)
            span.finish(); 
        }
    }
}