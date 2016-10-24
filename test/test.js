
const path = require('path');
const Metatab = require('../metatab.js');
const assert = require('assert');
const fs = require('fs');
const flatten = require('./flatten.js');

var urlbase = 'https://raw.githubusercontent.com/CivicKnowledge/metatab/master/test-data/';

//
// NOTE! THe files are pulled form the python metatab-py package, so you first
// have to git clone https://github.com/CivicKnowledge/metatab-py.git in the
// same directory that holds metatab-js. 
function testData(v){
    
    for( var i = 3, d = __filename; i; i--){
        d = path.dirname(d);
    }
    
    console.log(d);
    return path.join(d, 'metatab-py', 'test-data',v);
}

function dumpTerms(ti){
    for(var i = 0; i < ti.parsedTerms.length; i++){
        for(var j = 0; j < ti.parsedTerms[i].length; j++){
            console.log(ti.parsedTerms[i][j].toString());
        }
    }
}

for (var fn of ['issue1','example1', 'example2','children']){
    var ti = new Metatab.TermInterpreter( testData(fn+'.csv'))
    var obj = JSON.parse(fs.readFileSync(testData('json/'+fn+'.json'), 'utf8'));
    
    ti.run();
    
    var errors = flatten.compareDict(obj, ti.toDict());
    if (errors.length){ 
        console.log('======= ',fn);
        console.log(errors);
        console.log('---- ');
        dumpTerms(ti);
        console.log(flatten.flatten(obj));
        console.log('---- ');
        console.log(flatten.flatten(ti.toDict()));
    } else {
        console.log("OK",fn);
    }
}





