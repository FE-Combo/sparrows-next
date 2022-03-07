import Router from 'koa-router';
import {ParameterizedContext} from "koa"
import {ContextState} from "../type"
import { parse } from 'url'

export type RouterCTX = ParameterizedContext<ContextState, Router.IRouterParamContext<any, {}>, any>;

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
    const { req, res } = ctx
    const parsedUrl = parse(req.url!, true)
    await ctx.state.handle(req, res, parsedUrl)
    ctx.respond = false
    await next()
})



export default router;