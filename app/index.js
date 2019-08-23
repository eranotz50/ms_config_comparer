var url = "mongodb://uk1lv8442:27017,nl1lv8443:27017,az-lv8444:27017?connect=replicaSet&amp;replicaSet=Market_Streamer_Config_ReplSet&amp;readPreference=primaryPreferred&amp;connectTimeoutMS=30000";
var dbName = "MarketStreamer_Algorithm";

var Dal = require('./dal.js').Dal;
var dal = new Dal(url,dbName);
console.log(dal);






