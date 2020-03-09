import { join } from 'path';
import { lstatSync } from 'fs';
import Util from './util';

// global interfaces
// declare env | config props in global objects
declare global {
  type Env = (envVar: string, defaultVal?: string) => any | undefined;
  type Config = (envVar: string, defaultVal?: string) => any | undefined;
  let env: Env;
  let config: Config;

  namespace NodeJS {
    interface Global {
      env: Env;
      config: Config;
    }
  }
}

/**
 * config class that carries all configs loaded from config files.
 * init method is used to load current loaded file's configs to the class.
 * setPath method is used to change config files directory.
 * config method is used by global object to access Configs.
 */
class Configuration {
  private static conf: any;
  private static currentSelectedPath: string;
  private static supportedExt = ['index.js', 'index.ts'];

  private static init = (configFile: string) => {
    try {
      const conf = require(configFile);
      Configuration.conf = conf.default;
    } catch (e) {
      throw new Error('cannot require config file.');
    }
  };

  static setPath = (filePath: string = join(process.cwd(), 'config')): void => {
    Configuration.currentSelectedPath = filePath;
    try {
      if (lstatSync(filePath).isDirectory()) {
        const files = Util.loadMatchFilesPaths(filePath, Configuration.supportedExt);
        filePath = files[0];
        Configuration.init(filePath);
      }
    } catch (e) {
      if (filePath !== join(process.cwd(), 'config'))
        throw new Error(`invalid directory [${filePath}], couldn't find config file`);
    }
  };

  static config: Config = (keyName: string, defaultVal?: any): any => {
    const prop = Util.getProp(Configuration.conf, keyName);
    if (prop !== undefined) return prop;
    if (defaultVal !== undefined) return defaultVal;
    throw new Error(`config [${keyName}] is unreachable from path [${Configuration.currentSelectedPath}]`);
  };
}

// implicit config & env methods to global objects.
const globalObj = global;

globalObj.config = Configuration.config;

globalObj.env = (envVar: string, defaultVal?: string): any | undefined => {
  if (process.env[envVar] !== undefined && process.env[envVar] !== '') return process.env[envVar];
  if ((process.env[envVar] === undefined || process.env[envVar] === '') && defaultVal !== undefined) return defaultVal;
  return undefined;
};

// set config
Configuration.setPath();
// end set config

export const setPath = Configuration.setPath;
