"use strict";

var util = require("util");
var istanbul = require('istanbul');

function Instrumenter(opt) {
    this.opt = opt || {};
    istanbul.Instrumenter.call(this, opt);
}

util.inherits(Instrumenter, istanbul.Instrumenter);

Instrumenter.prototype.getPreamble = function(sourceCode, emitUseStrict) {
    var varName = this.opts.coverageVariable || '__coverage__',
        file = this.coverState.path.replace(/\\/g, '\\\\'),
        tracker = this.currentState.trackerVar,
        coverState,
        strictLine = emitUseStrict ? '"use strict";' : '',
        // return replacements using the function to ensure that the replacement is
        // treated like a dumb string and not as a string with RE replacement patterns
        replacer = function (s) {
            return function () { return s; };
        },
        code;
    if (!this.opts.noAutoWrap) {
        this.fixColumnPositions(this.coverState);
    }
    if (this.opts.embedSource) {
        this.coverState.code = sourceCode.split(/(?:\r?\n)|\r/);
    }
    coverState = this.opts.debug ? JSON.stringify(this.coverState, undefined, 4) : JSON.stringify(this.coverState);
    code = [
        "%STRICT%",
        "var %VAR% = require('istanbul-jpm/global').global;",
        "if (!%VAR%.%GLOBAL%) { %VAR%.%GLOBAL% = {}; }",
        "%VAR% = %VAR%.%GLOBAL%;",
        "if (!(%VAR%['%FILE%'])) {",
        "   %VAR%['%FILE%'] = %OBJECT%;",
        "}",
        "%VAR% = %VAR%['%FILE%'];"
    ].join("\n")
        .replace(/%STRICT%/g, replacer(strictLine))
        .replace(/%VAR%/g, replacer(tracker))
        .replace(/%GLOBAL%/g, replacer(varName))
        .replace(/%FILE%/g, replacer(file))
        .replace(/%OBJECT%/g, replacer(coverState));
        return code;
};

module.exports = {
    Instrumenter: Instrumenter
};
