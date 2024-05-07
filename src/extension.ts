// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { window, workspace } from "vscode";
import { addApiMutation, addApiQuery } from "./commands/addApi";
import { addDropdownComponent } from "./commands/addDropdownComponent";
import { addFormComponent } from "./commands/addFormComponent";
import { generateFolderStructureCommand } from "./commands/generateFolderStructureCommand";
import { helloWorldCommand } from "./commands/helloWorldCommand";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(helloWorldCommand());

  if (workspace === undefined) {
    return window.showErrorMessage("Please select a workspace first");
  }

  context.subscriptions.push(generateFolderStructureCommand());
  context.subscriptions.push(addFormComponent());
  context.subscriptions.push(addApiMutation());
  context.subscriptions.push(addApiQuery());
  context.subscriptions.push(addDropdownComponent());
}

// This method is called when your extension is deactivated
export function deactivate() {}
