import { Uri } from "vscode";

export enum AppFileType {
  feature = "feature",
}

export class AppFile {
  type!: AppFileType;
  name!: string;
  fullName!: string;
  uri!: Uri;
  associatedArray: string | undefined;
}
