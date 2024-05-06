import * as vscode from "vscode";
import { Uri } from "vscode";
import { Command } from "./commands";

const runCommand = (resource: Uri) => {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user
  vscode.window.showInformationMessage(
    "Hello World from Vite React Boilerplate Utils....!"
  );
};

export function helloWorldCommand() {
  console.log('Congratulations, "vite-react-boilerplate-utils" is active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    Command.helloWorld,
    (resource: Uri) => runCommand(resource)
  );

  return disposable;
}
