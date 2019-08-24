var url = "mongodb://uk1lv8442:27017,nl1lv8443:27017,az-lv8444:27017?connect=replicaSet&amp;replicaSet=Market_Streamer_Config_ReplSet&amp;readPreference=primaryPreferred&amp;connectTimeoutMS=30000";
var dbName = "MarketStreamer_Algorithm";

var Dal = require('./dal.js').Dal;
var dal = new Dal(url,dbName);

console.log('Connecting..');

dal.Connect().then(msg =>{
    console.log(msg);

    var fortradePromise = dal.Get("OutputInstrument", { OutputGroupId : 3});
    var gcmPromise = dal.Get("OutputInstrument", { OutputGroupId : 1});

    Promise.all([ fortradePromise, gcmPromise]).then( allItems =>{
        console.log(allItems);
    }).catch(err => {
        console.log('ERROR from one or more promises.');
        console.log(err);
    });


}).catch(err => {
    console.log(err);
});













