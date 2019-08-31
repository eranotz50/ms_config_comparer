


Array.prototype.first = (arr,predicate) => {

    var firstItem = null;

    for(var i = 0 ; i < this.length && firstItem == null; i++){
        if(predicate(this[i])){
            firstItem = this[i];            
        }
    }

    return firstItem;
}


var test = new  Array(1,2,3,4,5,6,7,8,9);
var item = test.first(test,i => i === 5);


var source =  { OutputGroupName : 'Fortrade' , OutputGroupId : 3} ;
var dest  =   { OutputGroupName : 'GCM' , OutputGroupId : 1};

var util = require('util');
var _comparer = require('./comparer.js').Comparer();

var dalConfig = require('./Config/dal.json');
var Dal = require('./dal.js');
var _dal = new Dal(dalConfig);

var Cache = require('./cache.js');
var _cache = new Cache(__dirname  + '\\Cache');

console.log('Running..');

(function () {

    GetFromCache()
        .then(cacheResult => {
            
            console.log('GetFromCache() completed successfully')
            
            LogCollections('Cache',cacheResult);   
            
            var promise = undefined;

            if(!cacheResult.systemInstruments|| !cacheResult.sourceInstruments || !cacheResult.destInstruments){
                console.log('GetFromDal()');

                promise = GetFromDal().then(dalResult => {        
                
                    LogCollections('Dal',dalResult);    
    
                    SaveToCache(dalResult)
                        .then(_ => "SaveToCache() completed.")
                        .catch(err => "Error in SaveToCache() -> " + err);       
                        
                    return dalResult;    
                })
                .catch(err => console.log("Unexpected error from GetFromDal() -> " + err))                                   
            }                     
            else{
               console.log('TakeFromCache()');
               promise  = Promise.resolve(cacheResult);
            }
            
            promise.then(result => {
                var spreadDiffResults = _comparer.Spread(result.systemInstruments,result.sourceInstruments,result.destInstruments);
            });


        })
        .catch( err => console.log('GetFromCache() Completed with an ERROR \n ' + err))      
})();

function LogCollections(caller,result){
    console.log(util.format('After %s -> sourceInstruments = %s, destInstruments =  %s, systemInstruments = %s',caller
        ,result.sourceInstruments ? result.sourceInstruments.length + ' Items from Cache' : "null"
        ,result.destInstruments ? result.destInstruments.length + ' Items from Cache' : "null"
        ,result.systemInstruments ? result.systemInstruments.length + ' Items from Cache' : "null"));
}

function GetFromCache(){

    var result = {};
    var promises = [];

    promises.push(_cache.Get("system")
        .then(items => result.systemInstruments = items)
        .catch(err => console.log(err)));

    promises.push(_cache.Get("ft")
        .then(items => result.sourceInstruments = items)
        .catch(err => console.log(err)));

    promises.push(_cache.Get("gcm")
        .then(items => result.destInstruments = items)
        .catch(err => console.log(err)));
    
    return Promise.all(promises).then(_ => result);       
}

function SaveToCache(result){
    
    var promises = [];

    promises.push(_cache.Save("system",result.systemInstruments)
        .then(msg =>console.log(msg))
        .catch(err => console.log(err)));

    promises.push(_cache.Save("ft",result.sourceInstruments)
        .then(msg => console.log(msg))
        .catch(err => console.log(err)));

    promises.push(_cache.Save("gcm",result.destInstruments)
        .then(msg => console.log(msg))
        .catch(err => console.log(err)));    
   
    return Promise.all(promises)
}


function GetFromDal(){

    var promises = [];

    return _dal.Connect().then(msg => {
        
        console.log('Connected -> ' + msg);
    
        var result = {};

        promises.push(_dal.Get(dalConfig.Collections.OutputInstrument, { OutputGroupId : source.OutputGroupId})
            .then(items => {
                items.forEach(i => i.OutputGroupName = source.OutputGroupName);
                result.sourceInstruments = items;
            })
            .catch(err => console.log('Error from Dal when quering for source -> ' + source + '\n' + err)));            
    
        promises.push(_dal.Get(dalConfig.Collections.OutputInstrument, { OutputGroupId : dest.OutputGroupId})
            .then(items => {                        
                items.forEach(i => i.OutputGroupName = dest.OutputGroupName);
                result.destInstruments = items;
            })
            .catch(err => console.log('Error from Dal when quering for dest -> ' + dest + '\n' + err)))                    

            promises.push(_dal.Get(dalConfig.Collections.SystemInstrument, {})
                .then(items => {
                    result.systemInstruments = items;
                })                    
                .catch(err => console.log('Error from Dal when quering for dest -> ' + dest + '\n' + err)));                                     
            
        return Promise.all(promises)
                .then(_ => result)
                .catch(err => console.log('ERROR from one or more promises. \n' + err));

    }).catch(err =>console.log('Connection ERROR -> ' + err))
}



    
















