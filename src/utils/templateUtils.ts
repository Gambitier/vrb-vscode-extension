import * as fs from "fs-extra";
import { render } from "mustache";
import path, { join } from "path";
import { TextEncoder } from "util";
import { Uri, commands, window, workspace } from "vscode";
import { AppFile } from "./appFile";

export async function createFileFromTemplate(file: AppFile) {
  const filePath = join(file.fileLocation.fsPath, file.nameWithExtension);

  if (fs.existsSync(filePath)) {
    return window.showErrorMessage("A file already exists with given name");
  }

  file.fileLocation = Uri.file(filePath);

  try {
    const data = await getFileTemplate(file);
    await workspace.fs.writeFile(
      file.fileLocation,
      new TextEncoder().encode(data)
    );
    await formatTextDocument(file.fileLocation);
  } catch (err: any) {
    return window.showErrorMessage(err);
  }

  return true;
}

export async function getFileTemplate(file: AppFile): Promise<string> {
  const parentDir = path.resolve(__dirname, "..");
  const templateFilePath = join(
    parentDir,
    `/templates/${file.templateFileName}.mustache`
  );

  const templateContent = await fs.readFile(templateFilePath, "utf8");

  const viewModel = {
    Name: file.name,
  };

  return render(templateContent, viewModel);
}

export async function formatTextDocument(uri: Uri) {
  const doc = await workspace.openTextDocument(uri);
  await window.showTextDocument(doc);
  await commands.executeCommand("editor.action.formatDocument");
  await saveAllFiles();
}

export async function saveAllFiles() {
  await workspace.saveAll();
}
