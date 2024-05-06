import { window, Uri, workspace, WorkspaceEdit, Position, commands, FileType } from 'vscode';
import * as fs from 'fs-extra';
import { join, basename } from 'path';
import { TextEncoder, TextDecoder } from 'util';
import { getPascalCase, getRelativePathForImport, getArraySchematics, getLineNoFromString, getClassName, getCamelCase } from './utils';
import { AppFile } from './appFile';
import { render } from 'mustache';

export async function createFile(file: AppFile) {

    if (fs.existsSync(join(file.uri.fsPath, file.name.toLowerCase() + `.${file.type}.ts`))) {
        return window.showErrorMessage('A file already exists with given name');
    }
    else {

        const stats = await workspace.fs.stat(file.uri);

        if (stats.type === FileType.Directory) {
            file.uri = Uri.parse(file.uri.path + '/' + file.fullName);
        }
        else {
            file.uri = Uri.parse(file.uri.path.replace(basename(file.uri.path), '') + '/' + file.fullName);
        }

        return getFileTemplate(file)
            .then((data) => {
                return workspace.fs.writeFile(file.uri, new TextEncoder().encode(data));
            })
            .then(() => {
                return addFilesToAppModule(file);
            })
            .then(() => {
                return formatTextDocument(file.uri);
            })
            .then(() => {
                return true;
            })
            .catch(err => { return window.showErrorMessage(err); });
    }
}

export async function formatTextDocument(uri: Uri) {
    return workspace.openTextDocument(uri)
        .then((doc) => {
            return window.showTextDocument(doc);
        })
        .then(() => {
            return commands.executeCommand('editor.action.formatDocument');
        });
}

export async function addFilesToAppModule(file: AppFile) {
    let moduleFile: Uri[] = [];

    // if (file.type === 'service' || file.type === 'controller') {
    //     moduleFile = await workspace.findFiles(`**/${file.name}.module.ts`, '**/node_modules/**', 1);
    // }

    if (moduleFile.length === 0 && file.name !== 'app') {
        moduleFile = await workspace.findFiles('**/app.module.ts', '**/node_modules/**', 1);
    }

    if (moduleFile.length !== 0) {
        workspace.saveAll()
            .then(() => {
                return workspace.fs.readFile(moduleFile[0]);
            })
            .then((data) => {
                return addToArray(data, file, moduleFile[0]);
            });
    }
}

export async function getFileTemplate(file: AppFile): Promise<string> {
    return fs.readFile(join(__dirname, `/templates/${file.type}.mustache`), 'utf8')
        .then((data: any) => {
            const name = getClassName(file.name);
            const type = getPascalCase(basename(file.uri.path).split('.')[1]);
            let view = {
                Name: name,
                Type: type,
                VarName: getCamelCase(name) + type
            };
            return render(data, view);
        });
}

export async function getImportTemplate(file: AppFile, appModule: Uri): Promise<string> {
    return fs.readFile(join(__dirname, `/templates/import.mustache`), 'utf8')
        .then((data: any) => {
            let view = {
                Name: getClassName(file.name) + getPascalCase(file.type),
                Path: getRelativePathForImport(appModule, file.uri)
            };
            return render(data, view);
        });
}

export async function addToArray(data: Uint8Array, file: AppFile, modulePath: Uri) {

    if (file.associatedArray !== undefined) {
        const pattern = getArraySchematics(file.associatedArray);
        let match;
        let pos: Position;
        let tempStrData = new TextDecoder().decode(data);

        if (match = pattern.exec(tempStrData)) {
            pos = getLineNoFromString(tempStrData, match);
            const toInsert = '\n        ' + getClassName(file.name) + getPascalCase(file.type) + ', ';
            let edit = new WorkspaceEdit();
            // handle file.type here 
            // if (file.type === AppFileType.filter) 
            edit.insert(modulePath, pos, toInsert);
            const importPath = await getImportTemplate(file, modulePath);
            edit.insert(modulePath, new Position(0, 0), importPath + '\n');

            return workspace.applyEdit(edit)
                .then(() => {
                    return formatTextDocument(modulePath);
                });
        }
    }
}