import { ParameterizedContext, Next, DefaultContext } from "koa";
import { RequestHandler } from "next/dist/server/next";
import compose from "koa-compose";
import "@sentry/tracing";
import * as NodeSentry from "@sentry/node";

export async function getConfig() {
  const configPath = process.cwd() + "/koa.config.js";
  const config = require(configPath);
  return config;
}

export interface CTXState {
  handle: RequestHandler;
  config: Record<string, any>;
}

const context =
  (handle: RequestHandler, config: Record<string, any>) =>
  async (ctx: ParameterizedContext<CTXState, DefaultContext>, next: Next) => {
    ctx.res.statusCode = 200;
    ctx.state = { handle, config };

    if (typeof config?.sentry?.dsn === "string") {
      NodeSentry.init(config.sentry);
      ctx.onerror = (error: Error) => {
        if (error) {
          NodeSentry.withScope(function (scope) {
            scope.addEventProcessor(function (event) {
              return NodeSentry.Handlers.parseRequest(event, ctx.request);
            });
            NodeSentry.captureException(error);
          });
          console.error(error);
        }
      };
    }

    if (config?.middlewares instanceof Array) {
      await compose(config?.middlewares)(ctx, next);
    } else {
      await next();
    }
  };

export default context;
