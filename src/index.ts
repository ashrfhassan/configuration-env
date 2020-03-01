import { join } from 'path';
import { lstatSync } from 'fs';
import Util from './util';

// declare env | config props in global objects
declare global {
  namespace NodeJS {
    interface Global {
      env: any;
      config: any;
    }
  }

  interface Window {
    env: any;
    config: any;
  }
}

/**
 * config class that carries all configs loaded from config files.
 * init method is used to load current loaded file's configs to the class.
 * setPath method is used to change config files directory.
 * config method is used by global object to access Configs.
 */
class Config {
  private static conf: any;
  private static currentSelectedPath: string;
  private static supportedExt = ['index.js', 'index.ts'];

  private static init = (configFile: string) => {
    try {
      const conf = require(configFile);
      Config.conf = conf.default;
    } catch (e) {
      throw new Error('cannot require config file.');
    }
  };

  static setPath = (filePath: string = join(process.cwd(), 'config')): void => {
    Config.currentSelectedPath = filePath;
    try {
      if (lstatSync(filePath).isDirectory()) {
        const files = Util.loadMatchFilesPaths(filePath, Config.supportedExt);
        filePath = files[0];
        Config.init(filePath);
      }
    } catch (e) {
      if (filePath !== join(process.cwd(), 'config'))
        throw new Error(`invalid directory [${filePath}], couldn't find config file`);
    }
  };

  static config = (keyName: string, defaultVal?: any): any => {
    const prop = Util.getProp(Config.conf, keyName);
    if (prop !== undefined) return prop;
    if (defaultVal !== undefined) return defaultVal;
    throw new Error(`config [${keyName}] is unreachable from path [${Config.currentSelectedPath}]`);
  };
}

// implicit config & env methods to global objects.
const globalObj = global || window;

globalObj.config = Config.config;

globalObj.env = (envVar: string, defaultVal?: string): any | undefined => {
  if (process.env[envVar] !== undefined && process.env[envVar] !== '') return process.env[envVar];
  if ((process.env[envVar] === undefined || process.env[envVar] === '') && defaultVal !== undefined) return defaultVal;
  return undefined;
};

// set config
Config.setPath();
// end set config

export const setPath = Config.setPath;
