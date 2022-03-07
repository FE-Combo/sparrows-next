import koa from 'koa';
import next from 'next';
import router from "./interior/router";
import context from "./interior/context";
import portfinder from "portfinder";
import chalk from "chalk";

const basePort = 3000;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : basePort // e.g: PORT=3000 yarn dev
portfinder.basePort = port;

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  
  const server = new koa()

  server.use(context(app, handle,router, {port, dev}))

  server.use(router.routes());

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