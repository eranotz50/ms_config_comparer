var Util = require('util').Util
var MongoClient = require('mongodb').MongoClient

function Dal(url,dbName){
    
    var _self = this;

    this.Connect = function(){
        return new Promise((resolve,reject) => {

            MongoClient.connect(url,function(err,server){
                
                if(err){
                    reject('Error connecting to mongo -> ' + err)    
                }
                else{
                    _self.Db = server.db(dbName)
                    if (typeof maybeObject == "undefined"){
                        reject('Could not find DB -> ' + dbName)
                    }
                    else{                        
                        resolve(Util.format('Connected to Mongo %s, %s ',url,dbName))        
                    }                    
                }                                                                                                            
            });

        })
    }
}

module.exports.Dal = Dal


/*

MongoClient.connect(url,function(err,server){

    console.log('connected')

    var dbo = server.db(dbName)
    var collection = dbo.collection("OutputInstrument")



    
    collection.find({ OutputGroupId : 3}).toArray()


});



*/