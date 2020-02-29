"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class Util {
}
exports.default = Util;
// loads all files paths in a given directory
Util.loadMatchFilesPaths = (dir, allowedFiles) => {
    const files = [];
    if (fs_1.lstatSync(dir).isDirectory())
        try {
            fs_1.readdirSync(dir).forEach((file) => {
                if (allowedFiles.indexOf(file) !== -1) {
                    files.push(path_1.join(dir, file));
                }
            });
        }
        catch (e) {
            console.log('error loading all files');
        }
    return files;
};
// deep getting object value
Util.getProp = (obj, key) => {
    return key.split('.').reduce((o, x) => {
        return typeof o === 'undefined' || o === null || o === '' ? undefined : o[x];
    }, obj);
};
