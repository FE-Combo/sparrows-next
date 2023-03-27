import {
  ParameterizedContext,
  DefaultState,
  DefaultContext,
  Next,
  Middleware,
} from "koa";
import { parse } from "url";
import { match } from "path-to-regexp";
import compose from "koa-compose";

// 作为微应用，子应用的baseRoute前缀必须与框架路由前缀保持一致
// e.g: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
const baseRoute = process.env.BASE_ROUTE;

export interface Options {
  whitelist?: (string | RegExp)[];
  redirectRoute?: string;
  baseRoute?: string;
  staticlist?: (string | RegExp)[];
  cookie?: string;
  // eslint-disable-next-line
  apiMiddlewares?: Middleware<any, any>[];
  // eslint-disable-next-line
  innerApiMiddlewares?: Middleware<any, any>[];
  // eslint-disable-next-line
  pageMiddlewares?: Middleware<any, any>[];
}

export const middleware =
  (options?: Options) =>
  async (
    ctx: ParameterizedContext<DefaultState, DefaultContext>,
    next: Next
  ) => {
    const {
      baseRoute: optionBaseRoute,
      redirectRoute,
      whitelist = [],
      staticlist = [],
      cookie = "s-sid",
      apiMiddlewares = [],
      innerApiMiddlewares = [],
      pageMiddlewares = [],
    } = options || {};
    const nextStaticlist = staticlist.concat([
      "/_next/static/(.*)",
      "/_next/webpack-hmr",
      "/__nextjs_original-stack-frame",
      "/manifest.json",
      "/favicon.ico",
    ]);
    const matchStaticlistUrl =
      nextStaticlist?.length > 0
        ? match(nextStaticlist, { decode: decodeURIComponent })
        : undefined;
    if (
      ctx.path === `${optionBaseRoute || baseRoute || ""}/health` &&
      ctx.method === "GET"
    ) {
      // 健康监测
      const { res } = ctx;
      res.writeHead(200, { "Content-type": "text/html" });
      res.end("ok");
    } else {
      if (matchStaticlistUrl && matchStaticlistUrl(ctx.path)) {
        // 静态资源，建议将静态资源文件存放至第三方服务来持久化存储或者在构建时移至.next/static/文件下
        const { req, res } = ctx;
        const parsedUrl = parse(req.url!, true);
        await ctx.state.handle(req, res, parsedUrl);
      } else {
        if (/^\/api\/.*/.test(ctx.path)) {
          // api路由
          await compose(apiMiddlewares)(ctx, next);
        } else if (/^\/\_api\/.*/.test(ctx.path)) {
          // 内置api路由
          await compose(innerApiMiddlewares)(ctx, next);
        } else {
          const matchWhitelistUrl =
            whitelist?.length > 0
              ? match(whitelist, { decode: decodeURIComponent })
              : undefined;
          if (
            matchWhitelistUrl &&
            !matchWhitelistUrl(ctx.path) &&
            !ctx.cookies.get(cookie)
          ) {
            // 页面路由白名单
            redirectRoute &&
              ctx.res.writeHead(302, { Location: redirectRoute });
            ctx.res.end();
          } else {
            // 页面路由
            await compose(pageMiddlewares)(ctx, next);
            const { req, res } = ctx;
            // 给 req 赋值可以实现 koa 与 next 通信
            const parsedUrl = parse(req.url!, true);
            await ctx.state.handle(req, res, parsedUrl);
          }
        }
      }
    }
  };
