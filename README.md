
# Metatab-JS

A Metatab parser for javascript. See http://metatab.org for an overview of the system. 

The module is developed in node, but is intended to also run in Google Script and browsers. More developement 
need to be done, but most of it would involved changes to `generateRowsSync` and `generateRows` in generaterows.js.

Note that the parsing is synchronous, because `Declare` terms, which reference other files, must be fully processed before
any following terms can be processed. There may be a way to make all IO asynchronous, but it would probably involve a significant change in structure. 

## Install

Install the development version from Github.

```bash
$ npm install CivicKnowledge/metatab-js
```

## Library

To produce JSON of a metatab file, given a file system path or URL:

```javascript

var ti = new Metatab.TermInterpreter(urlOrFilePath);
var json = JSON.stringify(ti.run().toDict());

```
# Command line

When the module is installed with `npm`, it also created an executable `metatab-js`, which can parse files from the shell:

```bash
$ metatab-js  https://raw.githubusercontent.com/CivicKnowledge/metatab-py/master/test-data/children.csv
```
The `metatab-js` program is very simple. For a more complete, robust command line parser, [install the python module](https://github.com/CivicKnowledge/metatab-py) and run the `metatab` program. 
