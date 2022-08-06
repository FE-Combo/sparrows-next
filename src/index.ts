/// <reference path="./koa-onerror.d.ts" />

import Koa from 'koa';
import next from 'next';
import context from "./interior/context";
import portfinder from "portfinder";
import onerror from "koa-onerror";
import chalk from "chalk";

export async function getConfig() {
  const configPath = process.cwd() + "/koa.config.js";
  const config = require(configPath);
  return config;
}

const basePort = 3000;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : basePort // e.g: PORT=3000 yarn dev
portfinder.basePort = port;

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  
  const server = new Koa()

  const config = (await getConfig()) || {};
  
  onerror(server, config?.errorOptions);

  server.use(context(app, handle, {...config, port, dev}));

  portfinder.getPort(function (error, nextPort) {
    if(error) {
      console.error(error);
      return;
    }
    if(port!==nextPort) {
      console.info(`${chalk.yellow("warn")}  - Port ${port} is in use, trying ${nextPort} instead.`)
    }
    process.env.PORT = nextPort.toString()
    server.listen(nextPort, () => console.info(`${chalk.green("ready")} - started server on 0.0.0.0:${nextPort}, url: http://localhost:${nextPort}`))
  });
})