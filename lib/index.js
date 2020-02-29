"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("./util");
/**
 * config class that carries all configs loaded from config files.
 * init method is used to load current loaded file's configs to the class.
 * setPath method is used to change config files directory.
 * config method is used by global object to access Configs.
 */
class Config {
}
Config.supportedExt = ['index.js', 'index.ts'];
Config.init = (configFile) => {
    try {
        const conf = require(configFile);
        Config.conf = conf.default;
    }
    catch (e) {
        throw new Error('cannot require config file.');
    }
};
Config.setPath = (filePath = path_1.join(process.cwd(), 'config/index.js')) => {
    try {
        if (fs_1.lstatSync(filePath).isDirectory()) {
            const files = util_1.default.loadMatchFilesPaths(filePath, Config.supportedExt);
            filePath = files[0];
        }
    }
    catch (e) {
        throw new Error("invalid directory path, couldn't find config file");
    }
    Config.init(filePath);
};
Config.config = (keyName, defaultVal) => {
    const prop = util_1.default.getProp(Config.conf, keyName);
    if (prop !== undefined)
        return prop;
    if (defaultVal !== undefined)
        return defaultVal;
    throw new Error(`config ${keyName} not set or unreachable`);
};
// implicit config & env methods to global objects.
const globalObj = global || window;
globalObj.config = Config.config;
globalObj.env = (envVar, defaultVal) => {
    if (process.env[envVar] !== undefined && process.env[envVar] !== '')
        return process.env[envVar];
    if ((process.env[envVar] === undefined || process.env[envVar] === '') && defaultVal !== undefined)
        return defaultVal;
    return undefined;
};
// set config
Config.setPath();
// end set config
exports.setPath = Config.setPath;
