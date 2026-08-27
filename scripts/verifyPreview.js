import { deepStrictEqual } from "node:assert";
import { readdir, readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseAst } from "rollup/parseAst";
import { RuntimeReleaseDir, RuntimeRendererUrl, RuntimeVersion } from "../baseflow-node-renderer/runtimeContract.js";
import { createSharedImports, SharedDependencies } from "../baseflow-node-renderer/scripts/sharedDependencies.js";

const WorkspaceRoot = resolve(import.meta.dirname, "..");
const PreviewDir = resolve(WorkspaceRoot, "baseflow-preview");
const PublicSharedDir = resolve(WorkspaceRoot, "baseflow-node-renderer/public/shared");
const MigratedNodeIds = ["break"];
const Require = createRequire(import.meta.url);

const SharedExportContracts = [
  { id: "react", hasDefault: true },
  { id: "react/jsx-runtime", hasDefault: false },
  { id: "react-dom", hasDefault: true },
  { id: "react-dom/client", hasDefault: true },
];
const StaticSharedExportContracts = ["@baseflow/render-react"];

async function verifySharedDirectory() {
  const sharedDir = PublicSharedDir;
  await requireDirectory(sharedDir);

  for (const target of Object.values(createSharedImports())) {
    await requireFile(resolve(sharedDir, basename(target)));
  }

  await verifySharedExports();
}

async function verifySharedExports() {
  process.env.NODE_ENV = "production";

  for (const contract of SharedExportContracts) {
    const dependency = SharedDependencies.find(({ id }) => id === contract.id);
    if (!dependency) throw new Error(`共享依赖表缺少 ${contract.id}`);

    const outputFile = resolve(PublicSharedDir, `${dependency.outputName}.js`);
    const outputUrl = pathToFileURL(outputFile);
    outputUrl.searchParams.set("verify", String(Date.now()));

    const [sourceModule, outputModule] = await Promise.all([Promise.resolve(Require(contract.id)), import(outputUrl.href)]);
    const sourceExports = Object.keys(sourceModule).sort();
    const expectedExports = contract.hasDefault ? [...sourceExports, "default"].sort() : sourceExports;
    deepStrictEqual(Object.keys(outputModule).sort(), expectedExports, `${outputFile}: ESM 导出与 ${contract.id} production 包不一致`);

    for (const name of sourceExports) {
      if (outputModule[name] === undefined) throw new Error(`${outputFile}: 导出 ${name} 为 undefined`);
    }

    if (contract.hasDefault) {
      if (!outputModule.default || typeof outputModule.default !== "object") {
        throw new Error(`${outputFile}: 缺少有效的 default 模块对象`);
      }
      deepStrictEqual(Object.keys(outputModule.default).sort(), sourceExports, `${outputFile}: default 导出不是 ${contract.id} 的真实模块对象`);
    }
  }

  for (const id of StaticSharedExportContracts) await verifyStaticSharedExports(id);
}

async function verifyStaticSharedExports(id) {
  const dependency = SharedDependencies.find((item) => item.id === id);
  if (!dependency) throw new Error(`共享依赖表缺少 ${id}`);

  const sourceFile = fileURLToPath(import.meta.resolve(id));
  const outputFile = resolve(PublicSharedDir, `${dependency.outputName}.js`);
  const [sourceExports, outputExports] = await Promise.all([readStaticEsmExports(sourceFile), readStaticEsmExports(outputFile)]);
  deepStrictEqual(outputExports, sourceExports, `${outputFile}: ESM 导出与 ${id} 包不一致`);
}

async function readStaticEsmExports(file) {
  const source = await readFile(file, "utf8");
  const ast = parseAst(source);
  const names = new Set();

  for (const statement of ast.body) {
    if (statement.type === "ExportDefaultDeclaration") {
      names.add("default");
      continue;
    }
    if (statement.type === "ExportAllDeclaration") {
      throw new Error(`${file}: 静态导出校验不支持 export * 产物`);
    }
    if (statement.type !== "ExportNamedDeclaration") continue;

    if (statement.declaration?.type === "VariableDeclaration") {
      for (const declaration of statement.declaration.declarations) {
        if (declaration.id.type !== "Identifier") throw new Error(`${file}: 静态导出校验不支持解构导出`);
        names.add(declaration.id.name);
      }
    } else if (statement.declaration?.type === "FunctionDeclaration" || statement.declaration?.type === "ClassDeclaration") {
      if (statement.declaration.id) names.add(statement.declaration.id.name);
    }

    for (const specifier of statement.specifiers) {
      if (specifier.exported.type !== "Identifier" && specifier.exported.type !== "Literal") {
        throw new Error(`${file}: 无法识别静态导出名称`);
      }
      names.add(String(specifier.exported.name ?? specifier.exported.value));
    }
  }

  return [...names].sort();
}

async function verifyPreview() {
  const demoHtml = resolve(PreviewDir, "index.html");
  const rendererHtml = resolve(PreviewDir, RuntimeReleaseDir, "index.html");
  const monacoHtml = resolve(PreviewDir, "monaco/index.html");

  await verifySharedDirectory(PublicSharedDir);
  await verifyHtmlAssets(demoHtml);
  await verifyDemoRuntimeRenderer(demoHtml);
  await verifyHtmlAssets(rendererHtml);
  await verifyHtmlAssets(monacoHtml);
  await verifyImportMap(rendererHtml);
  await requireFile(resolve(PreviewDir, "mock.json"));
  for (const nodeId of MigratedNodeIds) await verifyNode(nodeId);
}

async function verifyDemoRuntimeRenderer(demoHtml) {
  const html = await readFile(demoHtml, "utf8");
  const metaTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find((match) => readHtmlAttribute(match[0], "name") === "baseflow-runtime-renderer");
  if (!metaTag) throw new Error(`${demoHtml}: 未找到 Runtime renderer 标记`);

  const actualRendererUrl = readHtmlAttribute(metaTag[0], "content");
  if (actualRendererUrl !== RuntimeRendererUrl) {
    throw new Error(`${demoHtml}: Runtime renderer 标记应为 ${RuntimeRendererUrl}，实际为 ${String(actualRendererUrl)}；请重新构建 demo`);
  }
}

function readHtmlAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];
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
  if (manifest.runtimeVersion !== RuntimeVersion) {
    throw new Error(`${outputPackage}: baseflow.runtimeVersion 必须为 ${RuntimeVersion}`);
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
