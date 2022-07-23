# SPARROWS-NEXT
- 麻雀虽小，五脏俱全；轻量级NEXT+KOA应用框架

## 特性
- 自定义Koa服务，支持Koa中间件
- 无入侵行为，保留next原有特性
- 支持接入sentry, 只上报koa错误信息, next错误上报逻辑需在next应用中注入。
- 异常统一处理机制

## build-in middlewares
- *context: 存储next、koa实例
- csrf: 防止csrf攻击
- redis: sesion管理，redis初始化、save/remove逻辑
- jaeger: jaeger链路查询
- proxy: 代理
- router: 提供api路由以及应用健康监测，支持跨域

## build-in utils
- apollo: 官方Apollo配置中心
- 密钥轮转: 更安全的密钥机制
- log4js: 日志生成工具

## 压测
- 一般都采用ab，wrk，siege等工具
- ab -r -n 1000 -c 50 http://localhost:3000/ 

## 使用
- 安装：yarn add sparrows-next --save
- 开发环境启动：sparrows dev
- 构建：next build
- 启动：sparrows start

## Attentions
- 框架本身只提供基础中间件与工具函数，具体api逻辑根据业务自定义
- 开启sentry时，会重写`ctx.onerror`，如果对`ctx.onerror`有特殊要求可以重新覆盖，但需要重新添加sentry上报逻辑否则sentry将失效。
- 如果作为独立服务部署请使用[sparrows](https://github.com/vocoWone/sparrows)
- 页面路由不允许存在`*/api/*`的格式，此格式专用于云端接口

## Q&A
- Q: 为什么不直接使用[API Routes](https://nextjs.org/docs/api-routes/introduction)特性？
- A: 如果只是简单的做一些api签名逻辑直接使用API Routes也是很好的解决方案。但该方式存在一些问题：1.不支持koa及相关成熟中间件；2.服务本身能力受限于next；3.所有流量都会经过next，4.无法配置跨域(微应用)。

- Q: 如何搭建api前端网关？
- A: 一个简单的api网关必须具备sesion管理（已提供）以及调用后端api的能力。如何调用后端api需要业务方自行封装api中间件。

## koa.config.js配置说明
- assetPrefix: CDN前缀
- middlewares: 中间件列表, 支持自定义中间件满足koa标准即可
- sentry: [sentry接入参数](https://docs.sentry.io/platforms/node/)