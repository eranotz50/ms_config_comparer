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
        .then(_ => console.log('GetFromCache() completed successfully'))
        .catch( err => console.log('GetFromCache() Completed with an ERROR \n ' + err))
        .finally(_ => {

            LogCollections('Cache');    

            GetFromDal()
                .then(_ => {        

                    LogCollections('Dal');    

                    if(sourceInstruments != null && destInstruments != null && systemInstruments != null){
                        var spreadCompareResult = _comparer.Spread(sourceInstruments,destInstruments,systemInstruments);                                                             
                    } 
                })              
                .catch(err => console.log("Unexpected error from GetFromDal() -> " + err))                                       
        });              
})();

function LogCollections(caller){
    console.log(util.format('After %s -> sourceInstruments = %s, destInstruments =  %s, systemInstruments = %s',caller
        ,sourceInstruments != null ? sourceInstruments.length + ' Items from Cache' : "null"
        ,destInstruments != null ? destInstruments.length + ' Items from Cache' : "null"
        ,systemInstruments != null ? systemInstruments.length + ' Items from Cache' : "null"));
}

function  GetFromCache(){

    var promises = [];

    promises.push(_cache.Get(source.OutputGroupName)
        .then(result => sourceInstruments = result)
        .catch(err => console.log(err)));

    promises.push(_cache.Get(dest.OutputGroupName)
        .then(result => destInstruments = result)
        .catch(err => console.log(err)));

    promises.push(_cache.Get(dalConfig.Collections.SystemInstrument)
        .then(result => systemInstruments = result)
        .catch(err => console.log(err)));

    return  Promise.all(promises);
}


function GetFromDal(){

    var promises = [];

    return _dal.Connect().then(msg => {
        
        console.log('Connected -> ' + msg);
    
        if(sourceInstruments == null){
            promises.push(_dal.Get(dalConfig.Collections.OutputInstrument, { OutputGroupId : source.OutputGroupId})
                .then(result => {
                    result.forEach(i => i.OutputGroupName = source.OutputGroupName);
                    sourceInstruments = result;
                })
                .catch(err => console.log('Error from Dal when quering for source -> ' + source + '\n' + err)));            
        }
    
        if(destInstruments == null){    
            promises.push(_dal.Get(dalConfig.Collections.OutputInstrument, { OutputGroupId : dest.OutputGroupId})
                .then(result => {                        
                    result.forEach(i => i.OutputGroupName = dest.OutputGroupName);
                    destInstruments = result;
                })
                .catch(err => console.log('Error from Dal when quering for dest -> ' + dest + '\n' + err)))                    
        }

        if(systemInstruments == null){
            promises.push(_dal.Get(dalConfig.Collections.SystemInstrument, {})
                .then(result => systemInstruments = result)                    
                .catch(err => console.log('Error from Dal when quering for dest -> ' + dest + '\n' + err)));                                     
        }
            
        return Promise.all(promises)
                .then(_ => console.log('All dal promises comeplted.'))
                .catch(err => console.log('ERROR from one or more promises. \n' + err));

    }).catch(err =>console.log('Connection ERROR -> ' + err))
}



    
















