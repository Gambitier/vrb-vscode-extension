import { Uri } from "vscode";

export enum AppFileType {
  module = "module",
}

export class NestFile {
  type!: AppFileType;
  name!: string;
  fullName!: string;
  uri!: Uri;
  associatedArray: string | undefined;
}

export const NestImports = {
  filter: `import { APP_FILTER } from '@nestjs/core';`,
};

export const NestProviders = {
  filter: `{
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
      },`,
};
