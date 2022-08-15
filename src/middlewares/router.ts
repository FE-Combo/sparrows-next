
import {ParameterizedContext, DefaultState,  DefaultContext, Next} from "koa";
import { parse } from 'url';

// 作为微应用，子应用的baseRoute前缀必须与框架路由前缀保持一致
// e.g: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
const baseRoute = process.env.BASE_ROUTE

// 当前组件需要在所有插件之前执行，跨域配置除外
export const middleware = () => async ( ctx: ParameterizedContext<DefaultState, DefaultContext>, next: Next) => {
    if(ctx.path===`${ctx.state.baseRoute || baseRoute || ""}/health` && ctx.method==="GET") {
        // 健康监测
        const { res } = ctx
        res.writeHead(200, { 'Content-type': 'text/html' })
        res.end("ok")
        ctx.respond = false
    } else if(ctx.path.includes("/_next/static/") || ctx.path.includes("/_next/webpack-hmr")) {
        // 静态资源
        // 暂时无法区分public与pages路由，建议将静态资源文件存放至第三方服务来持久化存储或者在构建时移至.next/static/文件下
        const { req, res } = ctx;
        const parsedUrl = parse(req.url!, true);
        await ctx.state.handle(req, res, parsedUrl);
        ctx.respond = false;
    } else if(/^\/api\/.*/.test(ctx.path)) {
        // 调用云端 api
        await next();
    } else {
        // next 页面路由
        await next();
        const { req, res } = ctx;
        const parsedUrl = parse(req.url!, true);
        await ctx.state.handle(req, res, parsedUrl);
        ctx.respond = false;
    }
}
