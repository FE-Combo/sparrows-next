
import {ParameterizedContext, DefaultState, DefaultContext, Next} from "koa";

// ref: https://github.com/koajs/koa/blob/master/docs/error-handling.md
export const middleware = () => async ( ctx: ParameterizedContext<DefaultState, DefaultContext>, next: Next) => {
  try {
    await next();
  } catch (error: any) {
    // will only respond with JSON
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      message: error.message
    };
  }
}
