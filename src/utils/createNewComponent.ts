import path from "path";
import * as vscode from "vscode";
import { Uri } from "vscode";
import { TemplateFileName } from "./appFile";
import { generateFilesSync } from "./fileTreeCreator";
import { createFileFromTemplate } from "./templateUtils";

/// generates following files at given vscode resource path
/// - {componentName}/{componentName}.tsx
/// - {componentName}/index.ts
export async function createNewComponent(
  componentName: string,
  resource: vscode.Uri,
  fileType: TemplateFileName
) {
  await generateFilesSync(
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
    resource.fsPath
  );

  const componentUri = Uri.file(path.join(resource.fsPath, componentName));

  await createFileFromTemplate({
    name: componentName,
    templateFileName: fileType,
    fileLocation: componentUri,
    nameWithExtension: `${componentName}.tsx`,
  });

  return componentUri;
}
