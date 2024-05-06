import * as vscode from "vscode";
import { Command } from "./commands";

export function helloWorldCommand() {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, "vite-react-boilerplate-utils" is active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "vite-react-boilerplate-utils.adas",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from Vite React Boilerplate Utils....!"
      );
    }
  );

  return disposable;
}
