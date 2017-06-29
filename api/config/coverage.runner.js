let remapIstanbul = require("remap-istanbul");


let coverage = remapIstanbul.loadCoverage("coverage/coverage.json");
let collector = remapIstanbul.remap(coverage, {
    exclude: new RegExp(".*.spec.ts")
});

// remap-istanbul -i coverage/coverage.json -o coverage/coverage-ts.json -t json -e external,node_modules,.*.spec.ts,~.*,webpack/bootstrap*,[?]
remapIstanbul.writeReport(collector, "json", {}, "coverage/coverage-ts.json").then(function () {

    // get remapped coverage so we can display results
    const remappedJson = require("../coverage/coverage-ts.json");
    coverage = Object.keys(remappedJson).reduce((result, source) => {
        result[source] = remappedJson[source];
        return result;
    }, {});

    collector.add(coverage);

    // use istanbul's reporters
    let istanbul = require("istanbul"),
    reporter = new istanbul.Reporter();

    reporter.add("text");
    reporter.add("lcovonly");
    reporter.write(
        collector,
        true,
        () => { }
    );
});
