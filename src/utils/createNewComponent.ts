import path from "path";
import * as vscode from "vscode";
import { Uri } from "vscode";
import { AppFileType } from "./appFile";
import { createFile } from "./file-helper";
import { generateFilesSync } from "./fileTreeCreator";

/// generates following files at given vscode resource path
/// - {componentName}/{componentName}.tsx
/// - {componentName}/index.ts
export async function createNewComponent(
  componentName: string,
  resource: vscode.Uri,
  fileType: AppFileType
) {
  generateFilesSync(
    {
      name: componentName,
      type: "directory",
      children: [
        {
          name: "index.ts",
          type: "file",
          fileContent: `export * from "./${componentName}";\n`,
        },
      ],
    },
    resource.path
  );

  const componentUri = Uri.parse(path.join(resource.path, componentName));

  await createFile({
    name: componentName,
    type: fileType,
    uri: componentUri,
    fullName: `${componentName}.tsx`,
  });

  return componentUri;
}
