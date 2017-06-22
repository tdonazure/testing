"use strict";
let ConfigBase = require("./webpack.config.base");

class Config extends ConfigBase {
    constructor() {
        super();
    }
}

module.exports = new Config();
