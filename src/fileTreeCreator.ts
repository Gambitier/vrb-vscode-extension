import fs from "fs";
import { join } from "path";

export type FileNode = {
  name: string;
  type: "directory" | "file";
  children?: FileNode[];
};

export function generateFiles(json: FileNode, basePath: string): void {
  if (!basePath) {
    throw new Error("invalid base path specified");
  }

  const path = join(basePath, json.name);

  if (json.type === "file") {
    createFile(path);
  } else if (json.type === "directory") {
    createDir(path);
    for (const child of json.children ?? []) {
      generateFiles(child, path);
    }
  }
}

function createDir(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log("Created directory:", path);
  }
}

function createFile(path: string, content: string = "") {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content);
    console.log("Created file:", path);
  }
}
