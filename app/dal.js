var Util = require('util');
var MongoClient = require('mongodb').MongoClient;

function Dal(url,dbName){
    
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

module.exports.Dal = Dal


/*

MongoClient.connect(url,function(err,server){

    console.log('connected')

    var dbo = server.db(dbName)
    var collection = dbo.collection("OutputInstrument")



    
    collection.find({ OutputGroupId : 3}).toArray()


});



*/