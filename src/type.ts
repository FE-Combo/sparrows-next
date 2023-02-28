import { NextServer, RequestHandler } from "next/dist/server/next";

export interface ContextState {
  app: NextServer;
  handle: RequestHandler;
  // eslint-disable-next-line
  options: Record<string, any>;
  // eslint-disable-next-line
  config: Record<string, any>;
}
