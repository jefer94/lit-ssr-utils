import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import sha1 from "../crypto/sha1";

const cache = new Map<string, any>();
const tmpPath = "./tmp";

if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath, 744);
}

const root = getRoot();

function count(str: string, substr: string): number {
  return str.match(new RegExp(substr, "g"))?.length ?? 0;
}

function getRoot() {
  let root = import.meta.dir;
  const regex = new RegExp(`src`, "g");
  let n = count(root, "src");

  if (n === 0) {
    console.error("getRoot() failed to find root");
    return root;
  }

  while (true) {
    root = path.resolve(root, "../");
    if (n !== count(root, "src")) break;
  }

  return root;
}

export default async function loadModule(
  dependency: string,
  ext: string = "ts"
): Promise<any> {
  const hash = sha1(dependency);

  // cache.
  if (cache.has(hash)) {
    return cache.get(hash);
  }

  const filePath = path.resolve(import.meta.dir, `${root}/tmp/${hash}.${ext}`);
  await fsp.writeFile(filePath, dependency);

  const module = await import(filePath);
  cache.set(hash, module);

  fsp.rm(filePath);

  return module;
}
