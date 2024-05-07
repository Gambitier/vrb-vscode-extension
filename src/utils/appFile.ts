import { Uri } from "vscode";

export const invalidFileNames =
  /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;

export enum AppFileType {
  // template: formComponent.mustache
  formComponent = "formComponent",
}

export class AppFile {
  type!: AppFileType;
  name!: string;
  fullName!: string;
  uri!: Uri;
}
