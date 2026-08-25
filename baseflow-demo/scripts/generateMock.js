import { access, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const WorkspaceRoot = resolve(ScriptDir, "../..");
const DefaultNodesDir = join(WorkspaceRoot, "baseflow-nodes");
const DefaultOutputFile = join(WorkspaceRoot, "baseflow-demo/public/mock.json");
const CollaborationApplyValues = new Set(["readonly", "modify"]);

function compareNames(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function requireObject(value, field, packageFile) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${packageFile}: ${field} 必须是对象`);
  }
  return value;
}

function requireString(value, field, packageFile, allowEmpty = true) {
  if (typeof value !== "string" || (!allowEmpty && value.length === 0)) {
    const suffix = allowEmpty ? "字符串" : "非空字符串";
    throw new Error(`${packageFile}: ${field} 必须是${suffix}`);
  }
  return value;
}

export function mapPackageManifest(packageJson, packageFile) {
  const packageData = requireObject(packageJson, "package", packageFile);
  const packageName = requireString(packageData.name, "package.name", packageFile, false);
  const baseflow = requireObject(packageData.baseflow, "package.baseflow", packageFile);
  const defaultData = requireObject(baseflow.defaultData, "package.baseflow.defaultData", packageFile);
  const meta = requireObject(defaultData.meta, "package.baseflow.defaultData.meta", packageFile);

  const mapped = {
    type: requireString(baseflow.type, "package.baseflow.type", packageFile),
    name: requireString(meta.name, "package.baseflow.defaultData.meta.name", packageFile),
    icon: requireString(baseflow.icon, "package.baseflow.icon", packageFile),
    desc: requireString(baseflow.desc, "package.baseflow.desc", packageFile),
    dsl: requireString(baseflow.defaultDsl, "package.baseflow.defaultDsl", packageFile),
  };

  if (Object.hasOwn(baseflow, "collaborationApply")) {
    if (!CollaborationApplyValues.has(baseflow.collaborationApply)) {
      throw new Error(`${packageFile}: package.baseflow.collaborationApply 必须是 readonly 或 modify`);
    }
    mapped.collaborationApply = baseflow.collaborationApply;
  }

  return { packageName, mapped };
}

async function findPackageFiles(nodesDir) {
  const entries = await readdir(nodesDir, { withFileTypes: true });
  const directoryNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareNames);
  const packageFiles = [];

  for (const directoryName of directoryNames) {
    const packageFile = join(nodesDir, directoryName, "package.json");
    try {
      await access(packageFile);
      packageFiles.push(packageFile);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }

  return packageFiles;
}

async function readPackageManifest(packageFile) {
  const content = await readFile(packageFile, "utf8");
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`${packageFile}: package.json 不是有效 JSON`, { cause: error });
  }
}

async function writeJsonAtomically(outputFile, content) {
  const outputDir = dirname(outputFile);
  const temporaryFile = join(outputDir, `.mock-${process.pid}-${Date.now()}.tmp`);
  await mkdir(outputDir, { recursive: true });

  try {
    await writeFile(temporaryFile, content, { encoding: "utf8", flag: "wx" });
    await rename(temporaryFile, outputFile);
  } finally {
    await rm(temporaryFile, { force: true });
  }
}

export async function generateMock({ nodesDir = DefaultNodesDir, outputFile = DefaultOutputFile } = {}) {
  const packageFiles = await findPackageFiles(nodesDir);
  if (packageFiles.length === 0) {
    throw new Error(`${nodesDir}: 未找到节点 package.json`);
  }
  const mock = {};

  for (const packageFile of packageFiles) {
    const packageJson = await readPackageManifest(packageFile);
    const { packageName, mapped } = mapPackageManifest(packageJson, packageFile);
    if (Object.hasOwn(mock, packageName)) {
      throw new Error(`${packageFile}: package.name 重复: ${packageName}`);
    }
    mock[packageName] = mapped;
  }

  const content = `${JSON.stringify(mock, null, 2)}\n`;
  await writeJsonAtomically(outputFile, content);
  return mock;
}

const IsMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (IsMain) {
  const mock = await generateMock();
  console.log(`已生成 ${Object.keys(mock).length} 个节点: ${DefaultOutputFile}`);
}
