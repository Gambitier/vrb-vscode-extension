import { Uri } from "vscode";

export const invalidFileNames =
  /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;

export enum TemplateFileName {
  // template: formComponent.mustache
  formComponent = "formComponent",
  routeComponent = "routeComponent",
  apiMutation = "apiMutation",
  apiQuery = "apiQuery",
  dropdownComponent = "dropdownComponent",
  materialReactTableComponent = "materialReactTableComponent",

  // stepped form components
  steppedFormMainComponent = "steppedFormMainComponent",
  steppedFormParent = "steppedFormParent",
  steppedFormOne = "steppedFormOne",
  steppedFormSchema = "steppedFormSchema",
}

export class AppFile {
  name!: string;
  nameWithExtension!: string;
  fileLocation!: Uri;
  templateFileName!: TemplateFileName;
}
