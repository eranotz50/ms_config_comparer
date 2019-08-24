var url = "mongodb://uk1lv8442:27017,nl1lv8443:27017,az-lv8444:27017?connect=replicaSet&amp;replicaSet=Market_Streamer_Config_ReplSet&amp;readPreference=primaryPreferred&amp;connectTimeoutMS=30000";
var dbName = "MarketStreamer_Algorithm";

var source =  { OutputGroupName : 'Fortrade' , OutputGroupId : 3} ;
var dest  =   { OutputGroupName : 'GCM' , OutputGroupId : 1};


var Util = require('Util');
var Dal = require('./dal.js').Dal;
var Comparer = require('./dal.js').Comparer;
var dal = new Dal(url,dbName);


var Cache = require('./cache.js');


console.log('Connecting..');

var connectPromise = dal.Connect()
        .then(msg => console.log(msg))
        .catch(err => console.log(err))

Promise.all([connectPromise]);

var sourceRes = null;
var destRes = null;

Cache.Get(source)
    .then(result => sourceRes = { Instruments : result , Name : source.OutputGroupName})
    .catch(err => console.log(err));

Cache.Get(dest)
    .then(result => destRes = { Instruments : result , Name : dest.OutputGroupName})
    .catch(err => console.log(err));

var promises = [];
    
if(sourceRes == null){
    var sourcePromise = dal.Get("OutputInstrument", { OutputGroupId : source.OutputGroupId})
                        .then(result => sourceRes = { Instruments : result , Name : source.OutputGroupName })
                        .catch(err => console.log('Error from Dal when quering for source -> ' + source + '\n' + err));        

    promises.push(sourcePromise);
}

if(destRes == null){
    var destPromise = dal.Get("OutputInstrument", { OutputGroupId : dest.OutputGroupId})
                        .then(result => destRes = { Instruments : result, Name : dest.OutputGroupName})
                        .catch(err => console.log('Error from Dal when quering for dest -> ' + dest + '\n' + err));        

    promises.push(destPromise);
}
    
Promise.all(promises)
    .then(_ => {})
    .catch(err => console.log('ERROR from one or more promises. \n' + err));

if(sourceRes != null && destRes != null){

   // var spreadCompareResult = Comparer.Spread(sourceRes.Instruments,destRes.Instruments);

}














