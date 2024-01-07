import net from "net";
import * as protobuf from "protobufjs";

let root: protobuf.Root;
let Request: protobuf.Type;
let Response: protobuf.Type;
let ErrorType: protobuf.Type;

type Dependency = { code: string; ext: string };

async function render(
  html: string,
  dependencies: Dependency[] = [],
  timeout: number = 5000
): Promise<any> {
  const { promise, resolve, reject } = Promise.withResolvers<any>();
  const socket = net.connect("/tmp/lit-ssr.sock");
  const cancelId = setTimeout(() => {
    socket.end();
    reject(new Error("Timeout"));
  }, timeout);

  const body = {
    html,
    dependencies,
  };
  const errMsg = Request.verify(body);
  if (errMsg) {
    socket.end();
    reject(errMsg);
    return promise;
  } else {
    const message = Request.create(body);
    const buffer = Request.encode(message).finish();
    socket.write(buffer);
  }

  socket.on("data", (data) => {
    const decodedMessage = Response.decode(data);
    const decodedData = Response.toObject(decodedMessage);

    resolve(decodedData);
    clearTimeout(cancelId);
    socket.end();
  });
  socket.on("error", (err) => {
    reject(err);
    clearTimeout(cancelId);
    socket.end();
  });
  socket.on("close", () => {
    reject(new Error("Socket closed"));
    clearTimeout(cancelId);
    socket.end();
  });

  return promise;
}

async function main(): Promise<void> {
  root = await protobuf.load("ssr.proto");
  Request = root.lookupType("Request");
  Response = root.lookupType("Response");
  ErrorType = root.lookupType("Error");

  console.log(
    await render(
      "Your HTML content here",
      [
        {
          code: "2+2",
          ext: "ts",
        },
        {
          code: "2+2",
          ext: "ts",
        },
        {
          code: "2+2",
          ext: "ts",
        },
      ],
      60000
    )
  );
  // console.log(await render());
  // console.log(await render());
  // console.log(await render());
  // console.log(await render());
  // console.log(await render());
  // console.log(await render());
  // console.log(await render());
  // console.log(await render());
  // console.log(await render());
  // console.log(await render(1));
  console.log("done");
}
main();
