import { Elysia } from "elysia";
import { renderLitComponent } from "./render";
// import * as protobuf from "protobufjs";
// import * as Bun from "bun";

const port = process.env.PORT || 3000;

export default async function start() {
  // await sleep(10000);
  // Load the protobuf schema file asynchronously

  new Elysia().post("/", renderLitComponent).listen(port, () => {
    console.log(
      `Warning: this project execute all dependencies locally (that you provided in \`/\`), be cafeful.`
    );
    console.log(`listening on port ${port}.`);
  });
}
