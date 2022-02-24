import {ParameterizedContext, DefaultState,DefaultContext, Next} from "koa";
import { initTracer, ZipkinB3TextMapCodec, JaegerTracer } from 'jaeger-client';
import { FORMAT_HTTP_HEADERS, SpanContext ,Span} from 'opentracing';

export interface JaegerCTX extends DefaultContext {
    jaeger: {
        jaeger: JaegerTracer,
        parentSpan: Span,
    }
}

interface Options {
    endpoint: string;
    serviceName: string;
}

export const middleware = (options: Options) => async ( ctx: ParameterizedContext<DefaultState, JaegerCTX>, next: Next) => {
    const {endpoint, serviceName} = options
    const {jaeger,parentSpan, traceId} = initJaeger({serviceName, operationName:`${ctx.host}`, endpoint}, ctx)
    ctx.jaeger = {
        jaeger,
        parentSpan
    };
    ctx.set("traceid", traceId);
    const { headers: reqHeaders, method, host, query, body } = ctx.request
    const { headers: resHeasers } = ctx.response;
    parentSpan.setTag('reqHeaders', reqHeaders)
    parentSpan.setTag("host", host)
    parentSpan.setTag("method", method)
    parentSpan.setTag("path", ctx.path)
    parentSpan.setTag("query", query)
    parentSpan.setTag("body", body)
    parentSpan.setTag("resHeasers", resHeasers)
    await next();
    parentSpan.finish();
}

interface InitJaeger {
    serviceName: string;
    endpoint: string;
    operationName: string;
    parentSpan?: SpanContext;
}

let jaeger: JaegerTracer | null = null;

export function initJaeger(ooptions: InitJaeger, ctx: ParameterizedContext<DefaultState, JaegerCTX>) {
    const {serviceName, endpoint, parentSpan, operationName} = ooptions;
    const { headers } = ctx.req
    const jaegerConfig = {
        serviceName,
        sampler: {
            type:"const",
            param: 1,
        },
        reporter: {
            logSpans: false,
            collectorEndpoint: endpoint
        }
    };
    if(!jaeger) {
        jaeger = initTracer(jaegerConfig, {});
        const codec = new ZipkinB3TextMapCodec({ urlEncoding: true })
        jaeger.registerInjector(FORMAT_HTTP_HEADERS, codec)
        jaeger.registerExtractor(FORMAT_HTTP_HEADERS, codec)
    }
    const config = { childOf: parentSpan || jaeger.extract(FORMAT_HTTP_HEADERS, headers) || undefined  }
    const span = jaeger.startSpan(operationName, config)
    const traceId = span.context().toTraceId();
    return {jaeger, parentSpan: span, traceId};
}

export function createSubSpan (operationName: string,ctx: ParameterizedContext<DefaultState, DefaultContext>){
    const jaeger = ctx.jaeger as JaegerCTX["jaeger"]
    const config = { childOf: jaeger.parentSpan }
    const span = jaeger.jaeger.startSpan(operationName, config)
    return span;
}