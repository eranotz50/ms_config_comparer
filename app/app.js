var source =  { OutputGroupName : 'Fortrade' , OutputGroupId : 3} ;
var dest  =   { OutputGroupName : 'GCM' , OutputGroupId : 1};

var util = require('util');
var Comparer = require('./comparer.js').Comparer;
var comparer = Comparer();

var Dal = require('./dal.js');
var dalConfig = require('./Config/dal.json');
var dal = new Dal(dalConfig);

var Cache = require('./cache.js');
var cache = new Cache('./Cache');

var systemInstruments = null;
var sourceInstruments = null;
var destInstruments = null;

console.log('Running..');


(function () {

    var promises = [];

    promises.push(cache.Get(source.OutputGroupName)
        .then(result => sourceInstruments = result)
        .catch(err => console.log(err)));

    promises.push(cache.Get(dest.OutputGroupName)
        .then(result => destInstruments = result)
        .catch(err => console.log(err)));

    promises.push(cache.Get("SystemInstruments")
        .then(result => systemInstruments = result)
        .catch(err => console.log(err)));

    Promise.all(promises)
        .then(_ =>{
            console.log('Before GetFromDal()')
            // todo : check what's needed to return promise from GetFromDal()
            GetFromDal().then(_ => {
                 console.log('GetFromDal() complete.')
        
                if(sourceInstruments != null && destInstruments != null && systemInstruments != null){
                    var spreadCompareResult = Comparer.Spread(sourceInstruments,destInstruments,systemInstruments); 
                    
                    
                    
                }         
            }).catch(err => console.log("Unexpected error from GetFromDal() -> " + err))       
        } )
        .catch(_ => console.log('Cache check completed with Error on or more errors'));      
})();


function GetFromDal(){

    var promises = [];

    return dal.Connect().then(msg => {
        console.log(msg);
    
        if(sourceInstruments == null){
             console.log('dal.Get( source ) Start');
    
             var sourcePromise = dal.Get("OutputInstrument", { OutputGroupId : source.OutputGroupId})
                    .then(result => {
                        result.forEach(i => i.OutputGroupName = source.OutputGroupName);
                        sourceInstruments = result;

                        console.log('dal.Get( source ) Completed with ' + result.length + ' Items');
                    })
                    .catch(err => console.log('Error from Dal when quering for source -> ' + source + '\n' + err));        
    
            promises.push(sourcePromise);
        }
    
        if(destInstruments == null){
            console.log('dal.Get( dest ) Start');
    
            var destPromise = dal.Get("OutputInstrument", { OutputGroupId : dest.OutputGroupId})
                    .then(result => {                        
                        result.forEach(i => i.OutputGroupName = dest.OutputGroupName);
                        destInstruments = result;

                        console.log('dal.Get( dest ) Completed with ' + result.length + ' Items');
                    })
                    .catch(err => console.log('Error from Dal when quering for dest -> ' + dest + '\n' + err));        
    
            promises.push(destPromise);        
        }

        if(systemInstruments == null){
            console.log('dal.Get( system ) Start');

            var sysInstrumentsPromise = dal.Get("SystemInstrument", {})
            .then(result =>{
                systemInstruments = result;
                console.log('dal.Get( system ) Completed with ' + result.length + ' Itesm.');
            })
            .catch(err => console.log('Error from Dal when quering for dest -> ' + dest + '\n' + err));        

            promises.push(sysInstrumentsPromise);        
        }
            
        var p = Promise.all(promises).then(_ => console.log('All dal promises comeplted.'))
        .catch(err => console.log('ERROR from one or more promises. \n' + err));

        return p;
    
    }).catch(err => console.log(err))
}



    
















