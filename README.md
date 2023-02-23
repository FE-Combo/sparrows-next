![version](https://img.shields.io/npm/v/sparrows-next.svg)
![downloads](https://img.shields.io/npm/dt/sparrows-next.svg)

# SPARROWS-NEXT
- 依赖 [sparrows](https://github.com/vocoWone/sparrows)，增强next应用的koa框架

## 特性
- 完全复用 [sparrows](https://github.com/vocoWone/sparrows) 特性
- 自定义Koa服务，支持Koa中间件
- 无入侵行为，保留next原有特性

## build-in middlewares
- *context：存储next、koa实例、koa.config.js 配置获取

- app：提供应用健康监测/页面路由/api路由
    - baseRoute：应用前缀
    - whitelist：白名单
    - redirectRoute：重定向地址
    - cookie：cookie key，指定 key 不存在时重定向 redirectRoute 地址，添加白名单 whitelist 可绕过检测
    - staticlist：静态资源路由列表，内置路由有 `["/_next/static/(.*)", "/_next/webpack-hmr", "/__nextjs_original-stack-frame", "/manifest.json", "/favicon.ico"]`
    - apiMiddlewares：api路由中间件
    - pageMiddlewares：页面路由中间件
    
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
- sentry, 只上报koa错误信息, next错误上报逻辑需在next应用中注入
- 项目中的`Dockerfile`、`start.sh`无法用于当前demo
- 应用整体内存消耗一般在300m左右，cpu在0.3核左右

## koa.config.js配置说明（配置入口）
- middlewares: 中间件列表, 支持自定义中间件满足koa标准即可
- sentry: [sentry接入参数](https://docs.sentry.io/platforms/node/)
- errorOptions：处理 steam 和事件的异常，[配置参考](https://github.com/koajs/onerror#options)

## Q&A
- Q: 为什么不直接使用[API Routes](https://nextjs.org/docs/api-routes/introduction)特性？
- A: 如果只是简单的做一些api签名逻辑直接使用API Routes也是很好的解决方案。但该方式存在一些问题：1.不支持koa及相关成熟中间件；2.服务本身能力受限于next；3.所有流量都会经过next，4.无法配置跨域(微应用)。