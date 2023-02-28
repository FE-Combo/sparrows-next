import { NextServer, RequestHandler } from "next/dist/server/next";

export interface ContextState {
  app: NextServer;
  handle: RequestHandler;
  options: Record<string, any>;
  config: Record<string, any>;
}
