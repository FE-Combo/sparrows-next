import Router from 'koa-router';
import {ParameterizedContext, DefaultState,  DefaultContext, Next} from "koa";
import { parse } from 'url';

export type RouterCTX = ParameterizedContext<DefaultState, Router.IRouterParamContext<any, {}>, any>;


const router = new Router();

// 健康监测
router.get("/health", async (ctx:RouterCTX, next)=>{
    const { res } = ctx
    res.writeHead(200, { 'Content-type': 'text/html' })
    res.end("ok")
    ctx.respond = false
    await next() 
})

// 路由
router.get('(.*)', async (ctx: RouterCTX, next) => {
    // 只处理next页面路由，如果api路由未过滤则无法执行api路由相关逻辑
    if(!/\/api\/.*/.test(ctx.path)) {
        const { req, res } = ctx
        const parsedUrl = parse(req.url!, true)
        await ctx.state.handle(req, res, parsedUrl)
        ctx.respond = false
    }
    await next()
})


export const middleware = () => async (ctx: ParameterizedContext<DefaultState, RouterCTX>, next: Next) => {
    await router.routes()(ctx,next)
}
