import * as fs from "fs-extra";
import { render } from "mustache";
import { join } from "path";
import { TextEncoder } from "util";
import { Uri, commands, window, workspace } from "vscode";
import { AppFile } from "./appFile";

export async function createFile(file: AppFile) {
  const filePath = join(file.uri.fsPath, file.fullName);

  if (fs.existsSync(filePath)) {
    return window.showErrorMessage("A file already exists with given name");
  }

  file.uri = Uri.parse(filePath);

  try {
    const data = await getFileTemplate(file);
    await workspace.fs.writeFile(file.uri, new TextEncoder().encode(data));
    await formatTextDocument(file.uri);
  } catch (err: any) {
    return window.showErrorMessage(err);
  }

  return true;
}

export async function getFileTemplate(file: AppFile): Promise<string> {
  const templateContent = await fs.readFile(
    join(__dirname, `/templates/${file.type}.mustache`),
    "utf8"
  );

  const viewModel = {
    Name: file.name,
  };

  return render(templateContent, viewModel);
}

export async function formatTextDocument(uri: Uri) {
  const doc = await workspace.openTextDocument(uri);
  await window.showTextDocument(doc);
  await commands.executeCommand("editor.action.formatDocument");
}
