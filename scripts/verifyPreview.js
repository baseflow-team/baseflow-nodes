import { deepStrictEqual } from "node:assert";
import { readdir, readFile, stat } from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";
import { createSharedImports } from "../baseflow-node-renderer/scripts/sharedDependencies.js";

const WorkspaceRoot = resolve(import.meta.dirname, "..");
const PreviewDir = resolve(WorkspaceRoot, "baseflow-preview");
const PublicSharedDir = resolve(WorkspaceRoot, "baseflow-node-renderer/public/shared");
const MigratedNodeIds = ["break"];

async function verifySharedDirectory() {
  const sharedDir = PublicSharedDir;
  await requireDirectory(sharedDir);

  for (const target of Object.values(createSharedImports())) {
    await requireFile(resolve(sharedDir, basename(target)));
  }
}

async function verifyPreview() {
  const demoHtml = resolve(PreviewDir, "index.html");
  const rendererHtml = resolve(PreviewDir, "renderer/index.html");
  const monacoHtml = resolve(PreviewDir, "monaco/index.html");

  await verifySharedDirectory(PublicSharedDir);
  await verifyHtmlAssets(demoHtml);
  await verifyHtmlAssets(rendererHtml);
  await verifyHtmlAssets(monacoHtml);
  await verifyImportMap(rendererHtml);
  await requireFile(resolve(PreviewDir, "mock.json"));
  for (const nodeId of MigratedNodeIds) await verifyNode(nodeId);
}

async function verifyHtmlAssets(htmlFile) {
  const html = await readFile(htmlFile, "utf8");
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
    const pathName = reference.split(/[?#]/, 1)[0];
    const assetFile = pathName.startsWith("/") ? resolve(PreviewDir, `.${pathName}`) : resolve(dirname(htmlFile), pathName);
    assertInsidePreview(assetFile);
    await requireFile(assetFile);
  }
}

async function verifyImportMap(rendererHtml) {
  const html = await readFile(rendererHtml, "utf8");
  const match = html.match(/<script type="importmap">([\s\S]*?)<\/script>/);
  if (!match) throw new Error(`${rendererHtml}: 未找到 Import Map`);

  const actualImports = JSON.parse(match[1]).imports;
  const expectedImports = createSharedImports();
  deepStrictEqual(actualImports, expectedImports, `${rendererHtml}: Import Map 与共享依赖表不一致`);

  for (const target of Object.values(actualImports)) {
    await requireFile(resolve(dirname(rendererHtml), target));
  }
}

async function verifyNode(nodeId) {
  const sourcePackage = resolve(WorkspaceRoot, "baseflow-nodes", nodeId, "package.json");
  const outputDir = resolve(PreviewDir, "nodes", nodeId);
  const outputPackage = resolve(outputDir, "package.json");

  await requireFile(resolve(outputDir, "index.js"));
  await requireFile(outputPackage);

  const [sourceContent, outputContent] = await Promise.all([readFile(sourcePackage, "utf8"), readFile(outputPackage, "utf8")]);
  if (sourceContent !== outputContent) throw new Error(`${outputPackage}: 与节点源 package.json 不一致`);

  const manifest = JSON.parse(outputContent).baseflow;
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error(`${outputPackage}: 缺少有效的 baseflow manifest`);
  }

  const cssFiles = (await listFiles(outputDir)).filter((file) => file.endsWith(".css"));
  if (cssFiles.length > 0) throw new Error(`${outputDir}: 节点 CSS 应内联到 JS，发现 ${cssFiles.join(", ")}`);
}

async function listFiles(rootDir, currentDir = rootDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryFile = resolve(currentDir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(rootDir, entryFile)));
    else if (entry.isFile()) files.push(relative(rootDir, entryFile));
  }
  return files.sort();
}

async function requireFile(file) {
  const fileStats = await stat(file).catch(() => undefined);
  if (!fileStats?.isFile()) throw new Error(`缺少文件: ${file}`);
}

async function requireDirectory(directory) {
  const directoryStats = await stat(directory).catch(() => undefined);
  if (!directoryStats?.isDirectory()) throw new Error(`缺少目录: ${directory}`);
}

function assertInsidePreview(file) {
  const relativeFile = relative(PreviewDir, file);
  if (relativeFile.startsWith("..") || resolve(PreviewDir, relativeFile) !== file) {
    throw new Error(`拒绝验证 preview 之外的文件: ${file}`);
  }
}

const CommandArgs = process.argv.slice(2);
if (CommandArgs.length === 0) await verifyPreview();
else if (CommandArgs.length === 1 && CommandArgs[0] === "--shared") await verifySharedDirectory();
else throw new Error("仅支持无参数或 --shared");
