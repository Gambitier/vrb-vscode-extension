import fs from "fs";
import { join } from "path";

export type FileNode = {
  name: string;
  fileContent?: string;
  type: "directory" | "file";
  children?: FileNode[];
};

export function generateFilesSync(json: FileNode, basePath: string): void {
  if (!basePath) {
    throw new Error("invalid base path specified");
  }

  const path = join(basePath, json.name);

  if (json.type === "file") {
    createFileSync(path, json.fileContent);
  } else if (json.type === "directory") {
    createDirSync(path);
    for (const child of json.children ?? []) {
      generateFilesSync(child, path);
    }
  }
}

export function createDirSync(path: string) {
  if (fs.existsSync(path)) {
    return;
  }

  fs.mkdirSync(path);
  console.log("Created directory:", path);
}

export function createFileSync(path: string, content: string = "") {
  if (fs.existsSync(path)) {
    return;
  }

  fs.writeFileSync(path, content);
  console.log("Created file:", path);
}
