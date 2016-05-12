/*
 * Get the file saved by the SDK global counterpart.
 */

const path = require("path");
const os = require("os");
const fs = require("fs");

module.exports = {
    get global() {
        var coveragedir = process.env.coveragedir || os.tmpdir();
        var jsonFile = path.join(coveragedir, "istanbul-jpm-coverage.json");
        return JSON.parse(fs.readFileSync(jsonFile));
    }
};
