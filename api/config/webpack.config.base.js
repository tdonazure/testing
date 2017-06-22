"use strict";

let webpack = require("webpack");
let path = require("path");
let fs = require("fs");

class ConfigBase {
    constructor() {

        this.target = "node";

        let files = fs.readdirSync("./handlers");

        let entries = {};
        files.forEach(function(filename) {
            entries[filename.split(".")[0]] = "./handlers/" + filename;
        });

        this.entry = entries;

        this.output = {
            libraryTarget: "commonjs",
            path: "dist",
            filename: "[name].js"
        };

        this.resolve = {
            extensions: ["", ".js", ".ts"]
        };

        // collection of loaders that can be used
        this.configLoaders = {

            // Loader to convert .ts to .js (depends on tsconfig.json).
            ts: {
                test: /\.ts$/,
                loader: "awesome-typescript-loader"
            },

            //load .json files
            json: {
                test: /\.json$/,
                loader: "json-loader"
            }
        };

        // add loaders TODO - move to env specific config - JD
        this.module = {
            preLoaders: [],

            loaders: [
                this.configLoaders.ts,
                this.configLoaders.json
            ],

            postloaders: []
        }
    }
}

module.exports = ConfigBase;
