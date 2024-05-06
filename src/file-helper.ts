import * as fs from "fs-extra";
import { render } from "mustache";
import { basename, join } from "path";
import { TextDecoder, TextEncoder } from "util";
import {
  FileType,
  Position,
  Uri,
  WorkspaceEdit,
  commands,
  window,
  workspace,
} from "vscode";
import { AppFile } from "./appFile";
import {
  getArraySchematics,
  getCamelCase,
  getClassName,
  getLineNoFromString,
  getPascalCase,
  getRelativePathForImport,
} from "./utils";

export async function createFile(file: AppFile) {
  const filePath = join(file.uri.fsPath, file.fullName);

  if (fs.existsSync(filePath)) {
    return window.showErrorMessage("A file already exists with given name");
  }

  const stats = await workspace.fs.stat(file.uri);

  if (stats.type === FileType.Directory) {
    file.uri = Uri.parse(filePath);
  } else {
    file.uri = Uri.parse(
      file.uri.path.replace(basename(file.uri.path), "") + "/" + file.fullName
    );
  }

  try {
    const data = await getFileTemplate(file);
    await workspace.fs.writeFile(file.uri, new TextEncoder().encode(data));
    await addFilesToAppModule(file);
    await formatTextDocument(file.uri);
  } catch (err: any) {
    return window.showErrorMessage(err);
  }

  return true;
}

export async function formatTextDocument(uri: Uri) {
  return workspace
    .openTextDocument(uri)
    .then((doc) => {
      return window.showTextDocument(doc);
    })
    .then(() => {
      return commands.executeCommand("editor.action.formatDocument");
    });
}

export async function addFilesToAppModule(file: AppFile) {
  let moduleFile: Uri[] = [];

  // if (file.type === 'service' || file.type === 'controller') {
  //     moduleFile = await workspace.findFiles(`**/${file.name}.module.ts`, '**/node_modules/**', 1);
  // }

  if (moduleFile.length === 0 && file.name !== "app") {
    moduleFile = await workspace.findFiles(
      "**/app.module.ts",
      "**/node_modules/**",
      1
    );
  }

  if (moduleFile.length !== 0) {
    workspace
      .saveAll()
      .then(() => {
        return workspace.fs.readFile(moduleFile[0]);
      })
      .then((data) => {
        return addToArray(data, file, moduleFile[0]);
      });
  }
}

export async function getFileTemplate(file: AppFile): Promise<string> {
  return fs
    .readFile(join(__dirname, `/templates/${file.type}.mustache`), "utf8")
    .then((data: any) => {
      const name = getClassName(file.name);
      const type = getPascalCase(basename(file.uri.path).split(".")[1]);
      let view = {
        Name: name,
        Type: type,
        VarName: getCamelCase(name) + type,
      };
      return render(data, view);
    });
}

export async function getImportTemplate(
  file: AppFile,
  appModule: Uri
): Promise<string> {
  return fs
    .readFile(join(__dirname, `/templates/import.mustache`), "utf8")
    .then((data: any) => {
      let view = {
        Name: getClassName(file.name) + getPascalCase(file.type),
        Path: getRelativePathForImport(appModule, file.uri),
      };
      return render(data, view);
    });
}

export async function addToArray(
  data: Uint8Array,
  file: AppFile,
  modulePath: Uri
) {
  if (file.associatedArray !== undefined) {
    const pattern = getArraySchematics(file.associatedArray);
    let match;
    let pos: Position;
    let tempStrData = new TextDecoder().decode(data);

    if ((match = pattern.exec(tempStrData))) {
      pos = getLineNoFromString(tempStrData, match);
      const toInsert =
        "\n        " +
        getClassName(file.name) +
        getPascalCase(file.type) +
        ", ";
      let edit = new WorkspaceEdit();
      // handle file.type here
      // if (file.type === AppFileType.filter)
      edit.insert(modulePath, pos, toInsert);
      const importPath = await getImportTemplate(file, modulePath);
      edit.insert(modulePath, new Position(0, 0), importPath + "\n");

      return workspace.applyEdit(edit).then(() => {
        return formatTextDocument(modulePath);
      });
    }
  }
}
