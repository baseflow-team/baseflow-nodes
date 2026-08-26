import { cp, readFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

const Require = createRequire(import.meta.url);
const DemoRoot = resolve(import.meta.dirname, "..");
const MonacoDir = resolve(dirname(Require.resolve("monaco-editor")), "../..");
const MonacoPackage = JSON.parse(await readFile(join(MonacoDir, "package.json"), "utf8"));
const TargetDir = join(DemoRoot, `public/monaco/monaco-editor@${MonacoPackage.version}`);
const CopiedEntries = ["min", "LICENSE", "ThirdPartyNotices.txt"];

await rm(TargetDir, { recursive: true, force: true });
for (const entry of CopiedEntries) {
  await cp(join(MonacoDir, entry), join(TargetDir, entry), { recursive: true });
}

console.log(`已复制 monaco-editor@${MonacoPackage.version}: ${TargetDir}`);
