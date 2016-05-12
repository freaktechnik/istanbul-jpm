/*
 * Global object for istanbul test coverage
 */
const file = require("sdk/io/file");
const { when } = require("sdk/system/unload");
const system = require("sdk/system");

exports.global = {};

when(() => {
    let coveragedir = system.env.coveragedir || system.pathFor("TmpD");
    let stream = file.open(file.join(coveragedir, "istanbul-jpm-coverage.json"), "w");
    let string = JSON.stringify(exports.global);
    try {
        stream.write(string);
    }
    catch(e) {
        stream.close();
        console.log("Error while saving the istanbul-jpm coverage global to disk.");
        console.error(e);
    }
});
