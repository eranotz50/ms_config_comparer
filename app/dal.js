var Util = require('util');
var MongoClient = require('mongodb').MongoClient;

module.exports = function Dal(config){
    
    var url = config.Url;
    var dbName = config.DbName;

    var _self = this;
    _self.IsConnected = function(){
        return _self.Db != "undefined";
    }


    this.Connect = function(){
        return new Promise((resolve,reject) => {

            MongoClient.connect(url,{ useNewUrlParser: true , useUnifiedTopology: true},function(err,server){
                
                if(err){
                    reject('Error connecting to mongo -> ' + err)    
                }
                else{
                    _self.Db = server.db(dbName)
                    if (typeof _self.Db == "undefined"){
                        reject('Could not find DB -> ' + dbName)
                    }
                    else{       
                        
                        var resultMsg = Util.format('Connected to Mongo %s, %s ',url,dbName);                        
                        resolve(resultMsg) ;       
                    }                    
                }                                                                                                            
            });

        })
    }

    this.Get = function(collectionName,query){
        return new Promise((resolve,reject) => {
              
             if(_self.IsConnected === false){
                reject(new Error(Util.format('Connected to Mongo %s, %s ',url,dbName)))   
             }
             else{
                 var collection = _self.Db.collection(collectionName);
                 collection.find(query).toArray((err,items) =>{
                     if(err){
                         reject(Util.format('Error retriving items from collection %s, Query : %j ',collectionName,query));
                     }
                     else{
                         resolve(items);
                     }
                     
                 });    
             }
        });


    }

}



