import path from "path";
import * as vscode from "vscode";
import { Uri, window } from "vscode";
import { TemplateFileName, invalidFileNames } from "../utils/appFile";
import { generateFilesSync } from "../utils/fileTreeCreator";
import {
  createFileFromTemplate,
  formatTextDocument,
} from "../utils/templateUtils";
import { Command } from "./commands";

const runCommand = async (resource: Uri, fileType: TemplateFileName) => {
  const componentName = await window.showInputBox({
    placeHolder: "Please enter name",
  });

  if (componentName === undefined) {
    return;
  }

  if (invalidFileNames.test(componentName)) {
    return window.showErrorMessage("Invalid name");
  }

  const responseDtoFileName = `${componentName}ResponseDTO.ts`;
  generateFilesSync(
    {
      name: "types",
      type: "directory",
      children: [
        {
          name: "index.ts",
          type: "file",
        },
        {
          name: responseDtoFileName,
          type: "file",
          fileContent: `
            import { APIResponse } from "@/types/api";
            export type ${componentName}ResponseDTO = APIResponse<unknown>;
          `,
        },
      ],
    },
    resource.path
  );

  const ResponseDTOFilePath = path.join(
    resource.path,
    "types",
    responseDtoFileName
  );
  await formatTextDocument(Uri.parse(ResponseDTOFilePath));

  await createFileFromTemplate({
    name: componentName,
    templateFileName: fileType,
    fileLocation: resource,
    nameWithExtension: `${componentName}.ts`,
  });
};

export function addApiMutation() {
  let disposable = vscode.commands.registerCommand(
    Command.addApiMutation,
    (resource: Uri) => runCommand(resource, TemplateFileName.apiMutation)
  );

  return disposable;
}

export function addApiQuery() {
  let disposable = vscode.commands.registerCommand(
    Command.addApiQuery,
    (resource: Uri) => runCommand(resource, TemplateFileName.apiQuery)
  );

  return disposable;
}
