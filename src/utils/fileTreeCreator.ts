import fs from "fs";
import { join } from "path";
import { Uri } from "vscode";
import { TemplateFileName } from "./appFile";
import { createFileFromTemplate } from "./templateUtils";

export type FileNode = {
  name: string;
  fileContent?: string;
  fileTemplate?: TemplateFileName;
  type: "directory" | "file";
  children?: FileNode[];
};

export async function generateFilesSync(json: FileNode, basePath: string) {
  if (!basePath) {
    throw new Error("invalid base path specified");
  }

  const path = join(basePath, json.name);

  if (json.type === "file") {
    if (json.fileTemplate) {
      const file = {
        name: json.name.split(".")[0],
        nameWithExtension: json.name,
        fileLocation: Uri.parse(basePath),
        templateFileName: json.fileTemplate,
      };
      await createFileFromTemplate(file);
    } else {
      createFileSync(path, json.fileContent);
    }
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
