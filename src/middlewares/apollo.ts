
import {ParameterizedContext, DefaultState, DefaultContext, Next} from "koa";

// TODO:

interface Options {
    // 
}

export interface ApolloCTX  extends DefaultContext{
    
}

export const middleware = (options?: Options) => async ( ctx: ParameterizedContext<DefaultState, ApolloCTX>, next: Next) => {
    await next();
}
