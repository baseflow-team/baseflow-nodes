import { realpath } from "node:fs/promises";
import { resolve } from "node:path";

const WorkspaceRoot = await realpath(resolve(import.meta.dirname, ".."));
const CurrentDir = await realpath(process.cwd());
const InitialDir = process.env.INIT_CWD ? await realpath(process.env.INIT_CWD) : CurrentDir;

if (CurrentDir !== WorkspaceRoot || InitialDir !== WorkspaceRoot) {
  console.error(`构建命令必须在仓库根目录执行: ${WorkspaceRoot}`);
  process.exitCode = 1;
}
