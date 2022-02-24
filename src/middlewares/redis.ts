import {ParameterizedContext, DefaultState, Next, DefaultContext} from "koa";
import Redis from "ioredis";
import redisStore from "koa-redis";
import session, {SessionStore, SessionOptions} from "koa-generic-session";

export interface RedisCTX extends DefaultContext {
    redis: KoaRedis
}

export interface KoaRedis {
    redis: Redis.Redis,
    redisOptions: Redis.RedisOptions,
    sessionOptions: SessionOptions
}

export interface Options {
    redisOptions: Redis.RedisOptions
    sessionOptions: SessionOptions
}

let redis: Redis.Redis | null = null

export const middleware = (options: Options) => async ( ctx: ParameterizedContext<DefaultState, RedisCTX>, next: Next) => {
    const {redisOptions, sessionOptions} = options;
    ctx.keys = ["key", "keykeys"]
    if(!redis) {
        redis = new Redis(redisOptions);
    }
    ctx.redis = { redis, redisOptions, sessionOptions }
    await session({
        store: redisStore((redisOptions || {}) as redisStore.RedisOptions) as unknown as SessionStore,
    ...sessionOptions
    })(ctx, next);
}

export const saveSession = async (value: any, ctx: ParameterizedContext<DefaultState, RedisCTX>) => {
    try {    
        ctx.sessionId = "sid";
        ctx.session!.auth = value;
        if(ctx?.saveSession) await ctx.saveSession();
        return ctx.sessionId;
    } catch (error) {
        console.error(error)   
    }
}

export const removeSession = async (ctx: ParameterizedContext<DefaultState, RedisCTX>)=> {
    try {
        const redis = ctx.redis;
        const sidKey: string = redis.sessionOptions.key || 'sid';
        const key = ctx.cookies.get(sidKey);
        if(key) {
            ctx.session = null;
            await redis.redis.del(key)
        }
    } catch (error) {
        console.error(error)   
    }
}