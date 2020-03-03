Manage your Node.js (Back/Front)end Applications Configurations
===================================
[![NPM](https://nodei.co/npm/configuration-env.svg?downloads=true&downloadRank=true)](https://www.npmjs.com/package/configuration-env/)&nbsp;&nbsp;

Introduction
------------

configuration-env gives your js project the ability to maintain configurations in a good shape
as you have global access to your configs in the project as well as env variables in a simple way.

Project Guidelines
------------------

* *Simple* - as you only require it and use it globally.
* *Flexible* - Supporting multiple platforms (Front/back) end and typescript support.
* *Lightweight* - Small files

Quick Start
---------------
**Install in your app directory, and add config file.**

```shell
$ npm i --save configuration-env Or yarn add configuration-env
$ mkdir config
$ touch config/index.(js/ts)
```
note: priority will be for .js then .ts

```js
module.exports.default = {
    db: {
        host: env('DB_HOST', 'localhost'),
        port: env('DB_PORT', 3306),
        dbName: env('NAME', 'project')
    },
};
```
`env()`  is a method to reads from current project env with second optional param as a default value 
in case env variable not found, and will throw Error in case not found and no default value is set.

**Use configs in your code:**

```js
require('configuration-env');
db.connect(config('db.host'), ...);
```

`config()`  is a method to reads from (config/index.js) file with deep finding using `.` delimiter for each level, it has 
second optional param as a default value in case config not found,  and will throw Error in case not found and no default value is set.

**Update configs directory in your project:**

```js
const config = require('configuration-env');
config.setPath(__dirname + "/configuration")
db.connect(config('db.host'), ...);
```

