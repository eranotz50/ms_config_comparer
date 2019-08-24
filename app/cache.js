var Util = require('util');
const fs = require('fs');

module.exports = function Cache(basePath){

    this.Get = function(source){
            return new Promise(function(resolve,reject){
                    
                var jsonFilePath = Util.format('%s/%s.json',basePath,source.toLowerCase());
                fs.access(jsonFilePath, fs.F_OK,function(err) {
                    if(err){
                        reject('File does not exist -> ' + jsonFilePath + '\n' + err);                
                    }
                    else{        
                        fs.readFile(jsonFilePath, 'utf8', function(err, contents) {
                        if(err){
                            reject('Error reading from file -> ' + jsonFilePath);
                        }   
                        else{
                            resolve(contents);
                        }
                    });
                }
            })
        })
    }

    this.Save = function(source,contents){
            return new Promise(function(resolve,reject){
                        
                var jsonFilePath = Util.format('%s/%s.json',basePath,source);
                fs.access(jsonFilePath), fs.F_OK,(err) => {
                    if(err){
                        reject('File does not exist -> ' + jsonFilePath + '\\n' + err);                
                    }
                    else{        
                        fs.writeFile(jsonFilePath,contents, function(err) {
                        if(err){
                            reject('Error writing to file -> ' + jsonFilePath);
                        }   
                        else{
                            resolve(Util.format('%d items save to file %s',contents.length,jsonFilePath));
                        }
                    });
                }
            }
        })            
    }

}

    