import dts from "bun-plugin-dts";
import { mkdir } from "fs/promises";

try {
  await mkdir("./proto", { recursive: true });
} catch (err) {}

try {
  const file = Bun.file("./src/proto/ssr.proto");
  await Bun.write("./proto/ssr.proto", file);
} catch (err) {}

async function entrypoint(input) {
  const path = input.split("/");
  const fileName = path.pop();
  const typeName = fileName.replace(".ts", ".d.ts");
  const desttypeName = input.replace(typeName, typeName);

  path[1] = ".";
  const outdir = path.join("/");

  try {
    await mkdir(outdir, { recursive: true });
  } catch (err) {}

  await Bun.build({
    entrypoints: [input],
    outdir: outdir,
    minify: true,
    external: ["*"],
    plugins: [dts()],
  });
}

const entrypoints = [
  "./src/index.ts",
  "./src/api.ts",
  "./src/rpc.ts",
  "./src/crypto/sha1.ts",
  "./src/module/loadModule.ts",
  "./src/ssr/index.ts",
  "./src/ssr/render.ts",
  "./src/ssr/types.ts",
  "./src/ssr/validate.ts",
  "./src/adapters/elysia/index.ts",
  "./src/adapters/elysia/render.ts",
  "./src/adapters/unix-socket/bun.ts",
  "./src/adapters/unix-socket/node.ts",
];

entrypoints.forEach(async (x) => {
  await entrypoint(x);
});
