import { Uri } from "vscode";

export const invalidFileNames =
  /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;

export enum TemplateFileName {
  // template: formComponent.mustache
  formComponent = "formComponent",
}

export class AppFile {
  name!: string;
  nameWithExtension!: string;
  fileLocation!: Uri;
  templateFileName!: TemplateFileName;
}
