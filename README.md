# SPARROWS-NEXT
- 麻雀虽小，五脏俱全；轻量级NEXT应用框架一应俱全

## 特性
- 路由：健康监测、next路由（前端逻辑）、api路由（网关逻辑）
- koa定制（针对koa服务的配置）
- next定制（针对next开发与构建配置）
- 支持接入sentry, 但只上报koa错误信息, next错误信息需在next应用中注入。

## build-in middlewares
- *context: 存储next、koa、router实例
- *router: router插件，划分健康监测、next路由
- csrf: 防止csrf攻击
- redis: sesion管理，redis初始化、save/remove逻辑
- jaeger: jaeger日志存储
- proxy: 代理

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
- 开启sentry时，会重写`ctx.onerror`，如果对`ctx.onerror`有特殊要求可以重新覆盖，但需要添加sentry上报逻辑否则sentry会失效。

## koa.config.js配置说明
- assetPrefix: CDN前缀
- middlewares: 中间件列表, 支持自定义中间件满足koa标准即可
- sentry: sentry接入参数 ref: https://docs.sentry.io/platforms/node/
