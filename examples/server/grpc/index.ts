const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// const { Greeter } = protoLoader.loadSync("./x.proto");
const Greeter = protoLoader.loadSync("./x.proto");

const packageDefinition = protoLoader.loadSync("./x.proto", {});
const helloworld = grpc.loadPackageDefinition(packageDefinition).helloworld;

function sayHello(call, callback) {
  callback(null, { message: "Hello " + call.request.name });
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(helloworld.Greeter.service, { sayHello: sayHello });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
// //
// // console.log(
// //   "Hello from Node.js!",
// //   Object.keys(packageObject.helloworld.Greeter)
// // );
// // console.log("Hello from Node.js!", packageObject.Greeter);
// // const server = new grpc.Server();

// // const exampleServer = {
// //   // server handlers implementation...
// // };
// // server.addService(packageObject.example_package.Example.service, exampleServer);

// const client = new packageObject.helloworld.Greeter(
//   ":7777",
//   grpc.credentials.createInsecure()
// );

// const requestObject = {
//   name: "World", // Your request parameters according to the proto definition
// };

// const call = client.sayHello(requestObject, function (err, response) {
//   console.log("Greeting:", response);
//   // console.log("Greeting:", response.message);
//   console.log("Greeting:", err);
// });

// // call.on("data", (response) => {
// //   console.log(`Greeter client received: ${response.message}`);
// // });

// // call.on("end", () => {
// //   client.close();
// // });
