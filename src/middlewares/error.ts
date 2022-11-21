
import {ParameterizedContext, DefaultState, DefaultContext, Next} from "koa";

// ref: https://github.com/koajs/koa/blob/master/docs/error-handling.md
export const middleware = () => async ( ctx: ParameterizedContext<DefaultState, DefaultContext>, next: Next) => {
    try {
        await next();
      } catch (error) {
        console.error(error)
      }
}
