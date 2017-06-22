let Jasmine = require("jasmine");
let SpecReporter = require("jasmine-spec-reporter");

let reporters = require("jasmine-reporters");

let jasmine = new Jasmine();

jasmine.loadConfig({
    "spec_dir": "compiled_tests",
    "spec_files": [
        "**/*spec.js"
    ],
    "helpers": [
    ]
});

// clear reporters and add spec reporter for console results
jasmine.env.clearReporters();
jasmine.addReporter(new SpecReporter());

// add JUnitXmlReporter for qonarqube tracking
let junitReporter = new reporters.JUnitXmlReporter({
    savePath: "coverage",
    filePrefix: "test-results"
});
jasmine.addReporter(junitReporter);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

jasmine.execute();
