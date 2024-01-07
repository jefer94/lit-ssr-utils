import fs from "fs";
import * as protobuf from "protobufjs";

import rpc from "../../../../lit-ssr-utils/rpc";

let root: protobuf.Root;
let Request: protobuf.Type;
let ResponseType: protobuf.Type;
let ErrorType: protobuf.Type;

const socketPath = "/tmp/lit-ssr.sock";

// Delete the socket file if it already exists
if (fs.existsSync(socketPath)) {
  fs.unlinkSync(socketPath);
}

const [exec, ..._] = process.argv;

if (exec.indexOf("node") !== -1) {
  node();
} else if (exec.indexOf("bun") !== -1) {
  node();
  // FIXME: This doesn't work yet
  // bun();
} else {
  throw Error("Runtime not supported yet");
}

async function setup(): Promise<void> {
  root = await protobuf.load("ssr.proto");
  Request = root.lookupType("Request");
  ResponseType = root.lookupType("Response");
  ErrorType = root.lookupType("Error");
}

async function node(): Promise<void> {
  const net = await import("net");
  await setup();

  const server = net.createServer((socket) => {
    socket.on("data", async (data) => {
      const decodedMessage = Request.decode(data);
      const decodedData = Request.toObject(decodedMessage);

      const res = await rpc(decodedData);

      const message = ResponseType.create(res);
      const buffer = ResponseType.encode(message).finish();
      socket.write(buffer);
    });
  });

  server.listen(socketPath, () => {
    console.log(`Server listening on unix://${socketPath}!`);
  });
}

// FIXME: This doesn't work yet
async function bun(): Promise<void> {
  const Bun = await import("bun");
  await setup();

  const server = Bun.serve({
    unix: socketPath,
    async fetch(req) {
      try {
        const buffer = Buffer.from(await req.arrayBuffer());

        const decodedMessage = Request.decode(buffer);
        const decodedData = Request.toObject(decodedMessage);

        const res = await rpc(decodedData);

        const response = new Response(JSON.stringify(res));
        response.headers.set("Content-Type", "application/json");

        // const message = ResponseType.create(res);
        // const buffer = ResponseType.encode(message).finish();

        return response;
      } catch (err) {
        throw err; // Rethrow the error to prevent silent failures
      }
    },
  });

  console.log(`Server listening on unix://${socketPath}!`);
  await server;
}
