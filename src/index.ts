/// <reference path="./koa-onerror.d.ts" />

import Koa from "koa";
import next from "next";
import context from "./interior/context";
import portfinder from "portfinder";
import onerror from "koa-onerror";
import chalk from "chalk";

// if(process.env.DEBUG) {
//   const easyMonitor = require("easy-monitor");

//   easyMonitor("sparrows-next");
// }

export async function getConfig() {
  const configPath = process.cwd() + "/koa.config.js";
  const config = require(configPath);
  return config;
}

const basePort = 3000;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : basePort; // e.g: PORT=3000 yarn dev
portfinder.basePort = port;

const dev = process.env.NODE_ENV !== "production";
// dev 用于判断是否重新生成.next，也就是next dev 与 next start的区别

portfinder.getPort(function (error, nextPort) {
  if (error) {
    console.error(error);
    return;
  }
  if (port !== nextPort) {
    process.env.PORT = nextPort + "";
    console.info(
      `${chalk.yellow(
        "warn"
      )}  - Port ${port} is in use, trying ${nextPort} instead.`
    );
  }

  const app = next({ dev, port: nextPort });
  const handle = app.getRequestHandler();
  app
    .prepare()
    .then(async () => {
      const server = new Koa();

      const config = (await getConfig()) || {};

      // steam 和事件的错误直接由 ctx.onerror 处理
      onerror(server, config?.errorOptions);

      server.use(context(handle, { ...config, port, dev }));
      process.env.PORT = nextPort.toString();
      server.listen(nextPort, () =>
        console.info(
          `${chalk.green(
            "ready"
          )} - started server on 0.0.0.0:${nextPort}, url: http://localhost:${nextPort}`
        )
      );
    })
    .catch((error) => {
      console.error(error);
    });
});
