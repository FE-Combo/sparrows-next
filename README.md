# SPARROWS-NEXT
- 麻雀虽小，五脏俱全；轻量级NEXT应用框架一应俱全

## 特性
- 路由：健康监测、next路由
- 网关：阉割部分next路由增加前置逻辑
- koa定制（针对koa服务的配置）
- next定制（针对next开发与构建配置）

## build-in middlewares
- *context: 存储next、koa、router实例
- *router: router插件，划分健康监测、next路由
- csrf: 防止csrf攻击
- redis: sesion管理，redis初始化、save/remove逻辑
- jaeger: jaeger日志存储
- proxy: 代理

## 压测
- 一般都采用ab，wrk，siege等工具
- ab -r -n 1000 -c 50 http://localhost:3000/ 

## 使用
- 安装：yarn add sparrows-next --save
- 开发环境启动：sparrows dev
- 构建：next build
- 启动：sparrows start
