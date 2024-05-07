import { Uri } from "vscode";

export const invalidFileNames =
  /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;

export enum AppFileType {
  feature = "feature",
  formComponent = "formComponent",
}

export class AppFile {
  type!: AppFileType;
  name!: string;
  fullName!: string;
  uri!: Uri;
}
