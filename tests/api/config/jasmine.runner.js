let Jasmine = require("jasmine");
let SpecReporter = require("jasmine-spec-reporter");

let jasmine = new Jasmine();

jasmine.loadConfig({
    "spec_dir": "compiled_tests",
    "spec_files": [
        "**/*spec.js"
    ],
    "helpers": [
    ]
});

// Setup reporter
jasmine.env.clearReporters();
jasmine.addReporter(new SpecReporter());

// TODO: Consider blocking log output for code outside of tests.

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

jasmine.execute();
