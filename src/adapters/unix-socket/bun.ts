import fs from "fs/promises";
import * as protobuf from "protobufjs";

import rpc from "../../rpc";

const socketPath = "/tmp/lit-ssr.sock";

export default async function start(): Promise<void> {
  if (await fs.exists(socketPath)) {
    await fs.unlink(socketPath);
  }

  const rootType = await protobuf.load(
    import.meta.dir + "../../../proto/ssr.proto"
  );
  const RequestType = rootType.lookupType("Request");
  const ResponseType = rootType.lookupType("Response");
  // const ErrorType = rootType.lookupType("Error");

  const server = Bun.serve({
    unix: socketPath,
    async fetch(req) {
      try {
        const buffer = Buffer.from(await req.arrayBuffer());

        const decodedMessage = RequestType.decode(buffer);
        const decodedData = RequestType.toObject(decodedMessage);

        const res = await rpc(decodedData);

        const message = ResponseType.create(res);
        const buffer2 = ResponseType.encode(message).finish();

        const response = new Response(buffer2);
        response.headers.set("Content-Type", "application/protobuf");

        return response;
      } catch (err) {
        throw err; // Rethrow the error to prevent silent failures
      }
    },
  });

  console.log(`Server listening on unix://${socketPath}!`);
  await server;
}
