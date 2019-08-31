var source =  { OutputGroupName : 'Fortrade' , OutputGroupId : 3} ;
var dest  =   { OutputGroupName : 'GCM' , OutputGroupId : 1};

var util = require('util');
var _comparer = require('./comparer.js').Comparer();

var dalConfig = require('./Config/dal.json');
var Dal = require('./dal.js');
var _dal = new Dal(dalConfig);

var Cache = require('./cache.js');
var _cache = new Cache(__dirname  + '\\Cache');

var systemInstruments = null;
var sourceInstruments = null;
var destInstruments = null;

console.log('Running..');


(function () {

    GetFromCache()
        .then( result => {
            console.log('GetFromCache() completed successfully')
            
            LogCollections('Cache',result);   
            
            GetFromDal().then( result => {        
                
                LogCollections('Dal',result);    

                SaveToCache(result)
                    .then(_ => "SaveToCache() completed.")
                    .catch(err => "Error in SaveToCache() -> " + err);

                 //var spreadCompareResult = _comparer.Spread(result.systemInstrumentsתresult.sourceInstruments,result.destInstruments);                 


            })
            .catch(err => console.log("Unexpected error from GetFromDal() -> " + err))        
        })
        .catch( err => console.log('GetFromCache() Completed with an ERROR \n ' + err))
        /*.finally(result => {

            LogCollections('Cache');    

            GetFromDal().then(_ => {        

                    LogCollections('Dal');    

                    if(sourceInstruments != null && destInstruments != null && systemInstruments != null){
                        var spreadCompareResult = _comparer.Spread(sourceInstruments,destInstruments,systemInstruments);                                                             
                    } 
                })              
                .catch(err => console.log("Unexpected error from GetFromDal() -> " + err))                                       
        }); */
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



    
















