import fs from "fs/promises";
import * as protobuf from "protobufjs";
import net from "net";

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

  const server = net.createServer((socket) => {
    socket.on("data", async (data) => {
      const decodedMessage = RequestType.decode(data);
      const decodedData = RequestType.toObject(decodedMessage);

      const res = await rpc(decodedData);

      const message = ResponseType.create(res);
      const buffer = ResponseType.encode(message).finish();
      socket.write(buffer);
    });

    socket.on("end", () => {});

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  server.listen(socketPath, () => {
    console.log(`Server listening on unix://${socketPath}!`);
  });
}
