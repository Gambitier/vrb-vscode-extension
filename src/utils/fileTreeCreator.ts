import { join } from "path";
import { Uri, workspace } from "vscode";
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
      await workspace.fs.writeFile(
        Uri.file(path),
        new TextEncoder().encode(json.fileContent)
      );
    }
  } else if (json.type === "directory") {
    await workspace.fs.createDirectory(Uri.parse(path));
    for (const child of json.children ?? []) {
      generateFilesSync(child, path);
    }
  }
}
