
function SpreadDiff(sourceOutputsInst,destOutputInst,systemInstruments){

    var destDic = ToDictionary(destOutputInst, "SystemInstrumentId");
    var sysInstDic = ToDictionary(systemInstruments,"Id")

    var results = [];

    sourceOutputsInst.forEach(source => {
        
        var symbol = sysInstDic[source.SystemInstrumentId].Symbol;
        
        var result = { Symbol : symbol , SourceSpread : source.Spread};
        results.push(result);

        if(destDic[source.SystemInstrument]){
            var dest = destDic[source.SystemInstrument];
            result.DestSpread = dest.Spread;
            dest.isFound = true;
        }      
    });
        
    destOutputInst.forEach( dest => {
        if(typeof dest.isFound == "undefined"){
            
            var symbol = sysInstDic[source.SystemInstrumentId].Symbol;   
            
            var result = { Symbol : symbol , DestSpread : source.Spread};
            results.push(result);
        }        
    });

typeof _self.Db == "undefined"
  
    return results;
}
module.exports.Comparer =  function (){
   return {
        SpreadDiff : SpreadDiff  
   }       
}

function ToDictionary(arr,keySelector){
    var dic = {};
    arr.forEach(element => {
        if(!(dic[element[keySelector]])){
            dic[element[keySelector]] = element;
        }
    });
}
