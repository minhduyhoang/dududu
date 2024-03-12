import { IoAdapter } from "@nestjs/platform-socket.io";
import { createClient } from "redis";
import { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, // redis[s]://[[username][:password]@][host][:port][/db-number]
});
const subClient = pubClient.duplicate();
const redisAdapter = createAdapter(pubClient, subClient);

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}
