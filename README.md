# istanbul-jpm
Istanbul Instrumenter and coverage export for Firefox Add-on SDK extensions
tested with JPM.

## Installation
Run `npm install --save-dev istanbul-jpm` in the root of your extension directory.

## Usage
The index of this module exports the Instrumenter from istanbul adapted for use
with JPM. It does so by storing the coverage variable in a special object, that
gets written to the disk after all tests are done. This means, that this module
has to be packaged into the XPI file when running `jpm test` to measure coverage.
Note that istanbul doesn't need to be packaged with it.
```js
var Instrumenter = require("istanbul-jpm").Instrumenter;
```

The "global" that the Instrumenter wrote to can be accessed in node like this:
```js
const g = require("istanbul-jpm/global-node").global;
```
The module reads the data from the disk and returns it in object form on the
"global" property.

You might want to set the directory used to pass the coverage information from
the extension back to node using the environment variable `coveragedir`. By
default, it will use node's and Firefox's idea of the system's temp directory.
It is known that those do not match up on Max OS X.

## Example usage with grunt-istanbul

Also uses grunt-shell to launch `jpm test`.
```js
module.exports = function(grunt) {
    var istanbulJpm = require("istanbul-jpm");

    // Make sure Firefox writes the coverage info to the same dir we'll read from.
    process.env.coveragedir = require("os").tmpdir();

    grunt.initConfig({
        shell: {
            jpmTest: {
                command: 'jpm test'
            }
        },
        instrument: {
            files: 'lib/**/*.js',
            options: {
                lazy: true,
                basePath: 'coverage/instrument/',
                instrumenter: istanbulJpm.Instrumenter
            }
        },
        storeCoverage: {
            options: {
                dir: 'coverage/reports'
            }
        },
        makeReport: {
            src: 'coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'coverage/reports',
                print: 'detail'
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-istanbul');

    grunt.registerTask('readcoverageglobal', 'Reads the coverage global JPM wrote', function() {
        global.__coverage__ = require("istanbul-jpm/global-node").global.__coverage__;
        grunt.log.ok("Read __coverage__ global");
    });

    grunt.registerTask('test', ['instrument', 'shell:jpmTest', 'readcoverageglobal', 'storeCoverage', 'makeReport']);
};
```
