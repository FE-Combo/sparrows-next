import { ParameterizedContext, Next, DefaultState, DefaultContext } from 'koa'
import {NextServer, RequestHandler} from 'next/dist/server/next'
import compose from 'koa-compose';
import Router from "koa-router";

export function getConfig() {
  const configPath = process.cwd() + "/koa.config.js";
  const config = require(configPath);
  return config;
}

export interface CTXState {
  app:NextServer,
  handle: RequestHandler,
  router: Router,
  options: Record<string, any>
  config: Record<string, any>
}

const context = (app: NextServer, handle: RequestHandler, router: Router, options: Record<string, any>) => async (
  ctx: ParameterizedContext<CTXState, DefaultContext>,
  next: Next
) => {
  const config = getConfig();
  ctx.res.statusCode = 200;
  ctx.state = { app, handle, router, options, config}

  if(typeof config?.assetPrefix === "string") {
    app.setAssetPrefix(config.assetPrefix)
  }

  if(config?.middlewares instanceof Array) {
     await compose(config?.middlewares)(ctx, next)
  } else {
    await next()
  }
}

export default context
