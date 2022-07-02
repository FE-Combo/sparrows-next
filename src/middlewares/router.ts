import Router from 'koa-router';
import {ParameterizedContext, DefaultState, Next} from "koa";
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
router.all('(.*)', async (ctx: RouterCTX, next) => {
    // 跨域支持
    // 不能使用 ctx.res.setHeader 否则会导致 Error: Cannot set headers after they are sent to the client
    ctx.set('access-control-allow-origin', '*');
   
    if(!/\/api\/.*/.test(ctx.path)) {
        // 只处理next页面路由
        const { req, res } = ctx;
        const parsedUrl = parse(req.url!, true);
        await ctx.state.handle(req, res, parsedUrl);
        ctx.respond = false;
    } else {
        // /api路由（涉及网关逻辑）
        await next();
    }
})


export const middleware = () => async (ctx: ParameterizedContext<DefaultState, RouterCTX>, next: Next) => {
    await router.routes()(ctx,next)
}



// TODO: remove koa-router
// import {ParameterizedContext, DefaultState,  DefaultContext, Next} from "koa";
// import { parse } from 'url';

// export type RouterCTX = DefaultContext

// export const middleware = () => async ( ctx: ParameterizedContext<DefaultState, RouterCTX>, next: Next) => {
//     const { req, res } = ctx;
//     // 跨域支持
//     ctx.res.setHeader('access-control-allow-origin', '*');

//     if(ctx.path==="/health" && ctx.method==="GET") {
//         // 健康监测
//         const { res } = ctx
//         res.writeHead(200, { 'Content-type': 'text/html' })
//         res.end("ok")
//         ctx.respond = false
//     }  else if(!/\/api\/.*/.test(ctx.path)) {
//         // 处理next页面路由
//         const parsedUrl = parse(req.url!, true);
//         await ctx.state.handle(req, res, parsedUrl);
//         ctx.respond = false;
//     } else {
//         // /api路由（涉及网关逻辑）
//         await next();
//     }
// }
