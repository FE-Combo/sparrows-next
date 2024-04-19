![version](https://img.shields.io/npm/v/sparrows-next.svg)
![downloads](https://img.shields.io/npm/dt/sparrows-next.svg)

# SPARROWS-NEXT

- 依赖 [sparrows](https://github.com/vocoWone/sparrows)，增强 next 应用的 koa 框架

## 特性

- 完全复用 [sparrows](https://github.com/vocoWone/sparrows) 特性
- 自定义 Koa 服务，支持 Koa 中间件
- 无入侵行为，保留 next 原有特性

## build-in middlewares

- \*context：存储 next、koa 实例、koa.config.js 配置获取

- app：提供应用健康监测/页面路由/api 路由
  - baseRoute：应用前缀，也可以通过环境变量 BASE_ROUTE 配置。该配置对应应用中的 basePath
  - redirectRoute：重定向地址
  - cookie：cookie key
  - whitelist：无 cookie 时白名单列表。指定 cookie key 不存在且当前 path 不在 whitelist 中时则重定向至 redirectRoute 地址。可用于过滤无效页面请求（比如安全扫描）
  - staticlist：静态资源路由列表，内置路由有 `["([baseRoute])?/_next/static/(.*)", "([baseRoute])?/_next/webpack-hmr", "([baseRoute])?/__nextjs_original-stack-frame", "([baseRoute])?/manifest.json", "/([baseRoute])?favicon.ico"]`
  - apiMiddlewares：api 路由中间件，路由以`/api/`开头
  - innerApiMiddlewares： 内置 api 路由中间件，路由以`/_api/`开头
  - pageMiddlewares：页面路由中间件
  - 若项目中配置了 baseRoute，redirectRoute、whitelist 和 staticlist 需要手动添加 baseRoute，框架中不会自动添加。
- router：即将废弃

## 使用

- 安装：yarn add sparrows-next --save
- 启动：yarn sparrows（开发环境与线上环境启动命令相同，通过环境变量 NODE_ENV 区分）
- 构建：next build

## Docker

    ```
    TODO
    ```

## Attentions

- 如果作为独立服务部署请使用[sparrows](https://github.com/vocoWone/sparrows)
- 页面路由不允许存在`*/api/*`的格式，此格式专用于云端接口
- sentry, 只上报 koa 错误信息, next 错误上报逻辑需在 next 应用中注入
- 项目中的`Dockerfile`、`start.sh`无法用于当前 demo
- 应用整体内存消耗一般在 300m 左右，cpu 在 0.3 核左右

## koa.config.js 配置说明（配置入口）

- middlewares: 中间件列表, 支持自定义中间件满足 koa 标准即可
- sentry: [sentry 接入参数](https://docs.sentry.io/platforms/node/)
- errorOptions：处理 steam 和事件的异常，[配置参考](https://github.com/koajs/onerror#options)
## Q&A

- Q: 为什么不直接使用[API Routes](https://nextjs.org/docs/api-routes/introduction)特性？
- A: 如果只是简单的做一些 api 签名逻辑直接使用 API Routes 也是很好的解决方案。但该方式存在一些问题：1.不支持 koa 及相关成熟中间件；2.服务本身能力受限于 next；3.所有流量都会经过 next，4.无法配置跨域(微应用)。
