# istanbul-jpm
Istanbul Instrumenter and coverage export for Firefox Add-on SDK extensions
tested with JPM.

## Installation
Run `npm install --save-dev istanbul-jpm` in the root of your extension directory.

## Usage
The index of this module exports the Instrumenter from istanbul adapted for use
with JPM. It does so by storing the coverage variable in a special object, that
gets written to the disk after all tests are done.
```js
let Instrumenter = require("istanbul-jpm").Instrumenter;
``

The "global" that the Instrumenter wrote to can be accessed in node like this:
```js
let g = require("istanbul-jpm/global-node").global;
```
The module reads the data from the disk and returns it in object form on the
"global" property.
