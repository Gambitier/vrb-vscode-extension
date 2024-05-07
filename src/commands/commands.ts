// NOTE: When new command is added here,
// Remember to register these commands in package.json file under contributes.commands section
export enum Command {
  helloWorld = "extension.helloWorld",
  generateFolderStructure = "extension.generateFolderStructure",
  addFormComponent = "extension.addFormComponent",
  addApiMutation = "extension.addApiMutation",
  addApiQuery = "extension.addApiQuery",
}
