import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

export default class Util {
  // loads all files paths in a given directory
  static loadMatchFilesPaths = (dir: string, allowedFiles: string[]) => {
    const files: string[] = [];
    if (lstatSync(dir).isDirectory())
      try {
        readdirSync(dir).forEach((file: string) => {
          if (allowedFiles.indexOf(file) !== -1) {
            files.push(join(dir, file));
          }
        });
      } catch (e) {
        console.log('error loading all files');
      }
    return files;
  };

  // deep getting object value
  static getProp = (obj: any, key: string) => {
    return key.split('.').reduce((o, x) => {
      return typeof o === 'undefined' || o === null || o === '' ? undefined : o[x];
    }, obj);
  };
}
