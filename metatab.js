/*!
	Metatab-JS
	v0.0.1
	https://github.com/CivicKnowledge/metatab-js
*/


(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD
    define(['papaparse'], factory);
  } else if (typeof exports === 'object') {
      // CommonJS
    module.exports = factory(require('papaparse') );
  } else {
    // Browser globals (Note: root is window)
    root.returnExports = factory(root.Papa );
  }
}(this, function (Papa) {

    const ELIDED_TERM = '<elided_term>';
    const NO_TERM = '<no_term>';

    var splitTerm = function(term){
        
        if ( term.indexOf(".") >= 0 ){
            var parts = term.split(".");
            var parentTerm = parts[0].trim();
            var recordTerm = parts[1].trim();
        
            if (parentTerm == ''){
                parentTerm = ELIDED_TERM;
            }

        } else {
            var parentTerm = NO_TERM;
            var recordTerm = term.trim()
         
        }

        return [parentTerm, recordTerm];
    };
    
    var splitTermLower = function(term){
        var terms = splitTerm(term);
        return [terms[0].toLowerCase(), terms[1].toLowerCase()];
    };
    

    var Term = function (term, value, termArgs) {
        this.term = term;
        var p =  splitTermLower(this.term);
        this.parentTerm = p[0];
        this.recordTerm = p[1];
        
        this.value = value.trim();
        
        if (Array.isArray(termArgs)){
            this.termArgs = []
            for (var i=0; i < termArgs.length; i++){
                this.termArgs.push(termArgs[i]);
            }
        } else {
            this.termArgs = [];
        }
        
        this.children = [];
        
        this.section = null;
        this.fileName = null;
        this.row = null;
        this.col = null;
        
        this.termValueName = '@value';  

        this.childPropertyType  = 'any';
        this.valid = null;

        this.isArgChild= null;
        
        this.toString = function(){
            return "<Term "+this.parentTerm+"."+this.recordTerm+"="+
            this.value+" "+JSON.stringify(this.termArgs)+" >"
        }

    };

    var termFromRow = function(row){
        try {
            return new Term(row[0], row[1], row.slice(2));
        }  catch (e) {
            return null
            
        } 
        
         
    };

    var generateRows = function (path, cb) {
        console.log("parsing file");

        fs = require('fs')
        fs.readFile(path, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          
          var pr = Papa.parse(data);
          
          // TODO: Handle errors in rows
          
          for(var i = 0; i < pr['data'].length; i++){
              cb(i, pr['data'][i]);
          }
              
        });
    };
    
    var generateTerms = function(path, cb){
        
        generateRows(path, function(row_num, row){
            var term = termFromRow(row);
            if (term){
                term.row = row_num;
                term.col = 1;
                term.fileName = path;
                cb(term);
            } else {
                // TODO Handle error
            }
        });
    }
    
    var parse = function(path){
        
        generateTerms(path, function(term){
            console.log(term.toString()); 
        });
        
    }
    
    return {
      generateRows: generateRows,
      parse: parse
    };
}));

