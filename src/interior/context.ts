import { ParameterizedContext, Next, DefaultContext } from 'koa'
import {NextServer, RequestHandler} from 'next/dist/server/next'
import compose from 'koa-compose';
import "@sentry/tracing";
import * as NodeSentry from "@sentry/node";

export async function getConfig() {
  const configPath = process.cwd() + "/koa.config.js";
  const config = require(configPath);
  return config;
}

export interface CTXState {
  app:NextServer,
  handle: RequestHandler,
  options: Record<string, any>
  config: Record<string, any>
}

const context = (app: NextServer, handle: RequestHandler, options: Record<string, any>) => async (
  ctx: ParameterizedContext<CTXState, DefaultContext>,
  next: Next
) => {
  const config = await getConfig();
  ctx.res.statusCode = 200;
  ctx.state = { app, handle, options, config}

  if(typeof config?.sentry?.dsn === "string") {
    NodeSentry.init(config.sentry);
    ctx.onerror = (error: Error) => {
      if(error) {
        NodeSentry.withScope(function(scope) {
          scope.addEventProcessor(function(event) {
            return NodeSentry.Handlers.parseRequest(event, ctx.request);
          });
          NodeSentry.captureException(error);
        });
        console.error(error);
      }
    }
  }

  if(config?.middlewares instanceof Array) {
     await compose(config?.middlewares)(ctx, next)
  } else {
    await next()
  }

  // 必须在next handle之后执行，否则在微前端框架中作为子应用会报错
  if(typeof config?.assetPrefix === "string") {
    app.setAssetPrefix(config.assetPrefix)
  }
}

export default context
