/*
 * Get the file saved by the SDK global counterpart.
 */

const path = require("path");
const os = require("os");
const fs = require("fs");

module.exports = {
    get global() {
        var jsonFile = path.join(os.tmpdir(), "istanbul-jpm-coverage.json");
        return JSON.parse(fs.readFileSync(jsonFile));
    }
};
