import { Elysia } from "elysia";
import { renderLitComponent } from "./handlers";
import * as protobuf from "protobufjs";

const port = process.env.PORT || 3000;

async function setup() {
  // await sleep(10000);
  // Load the protobuf schema file asynchronously
  const root = await protobuf.load("response.proto");

  // Obtain a message type
  const HTMLMessage = root.lookupType("HTMLMessage");

  new Elysia()
    .post("/", renderLitComponent)
    .get("/test", () => ({ status: 200, body: "test" }))
    .get("/test2", async () => {
      try {
        // Create a JavaScript object conforming to the schema
        const htmlObject = {
          html: "Your HTML content here", // Replace with your HTML content
        };

        // Encode the object according to the protobuf schema
        const message = HTMLMessage.create(htmlObject);

        // Obtain the encoded message as a Buffer
        const buffer = HTMLMessage.encode(message).finish();

        // console.log("Encoded message:", buffer); // This is your encoded Protobuf message
      } catch (err) {
        // console.error("Error:", err);
      }
    })
    .get("/test3", () => ({ html: "Your HTML content here" }))
    .listen(port, () => {
      console.log(
        `Warning: this project execute all dependencies locally (that you provided in \`/\`), be cafeful.`
      );
      console.log(`listening on port ${port}.`);
    });
}

setup();
