import path from "path";
import * as vscode from "vscode";
import { Uri } from "vscode";
import { generateFiles } from "./fileTreeCreator";

export function generateNewComponentStructure(
  input: string,
  resource: vscode.Uri
) {
  generateFiles(
    {
      name: input,
      type: "directory",
      children: [
        {
          name: "index.ts",
          type: "file",
          fileContent: `export * from "./${input}";\n`,
        },
      ],
    },
    resource.path
  );

  const componentUri = Uri.parse(path.join(resource.path, input));
  return componentUri;
}
