"use strict";

let webpack = require("webpack");
let path = require("path");
let fs = require("fs");

class Config {
    constructor() {
        this.stats = {
            // Configure the console output
            errorDetails: true, //this does show errors
            colors: true,
            modules: true,
            reasons: true
        };

        this.target = "node";

        let files = fs.readdirSync("./specs");

        let entries = {};
        files.forEach(function(filename) {
            entries[filename.split(".ts")[0]] = "./specs/" + filename;
        });

        this.entry = entries;

        this.output = {
            libraryTarget: "commonjs",
            path: "compiled_tests",
            filename: "[name].js"
        };

        this.resolve = {
            extensions: ["", ".json", ".js", ".ts"]
        };

        // collection of loaders that can be used
        this.configLoaders = {

            // Loader to convert .ts to .js (depends on tsconfig.json).
            ts: { 
                test: /\.ts$/, 
                loader: "awesome-typescript-loader"
            },
            json: {
                test: /\.json$/,
                loader: "json-loader"
            },
            tslint: {
                test: /\.ts$/,
                loader: "tslint"
            }
        };

        this.module = {
            preLoaders: [],

            loaders: [
                this.configLoaders.json,
                this.configLoaders.ts
            ],

            postloaders: []
        }
    }
}

module.exports = new Config();
