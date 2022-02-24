import {NextServer, RequestHandler} from 'next/dist/server/next'
import Router from "koa-router"

export interface ContextState {
    app: NextServer,
    router: Router,
    handle: RequestHandler,
    options: Record<string, any>
    config: Record<string, any>
}

