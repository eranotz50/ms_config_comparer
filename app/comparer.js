
function SpreadDiff(systemInstruments,sourceInstruments,destInstruments){

    sourceInstruments = sourceInstruments.filter(i => i._t === "AggregatedOutputInstrument");
    destInstruments = destInstruments.filter(i => i._t === "AggregatedOutputInstrument");

    sourceInstruments

    var sourceDic = ToDictionary(sourceInstruments, "SystemInstrument");
    var destDic = ToDictionary(destInstruments, "SystemInstrument");

    var results = {
        headers = "Symbol"   
    }   

    systemInstruments.forEach(sys => {
        
        var res = { Symbol : sys.Symbol};

        var source = sourceDic[sys._id];    
        if(source){

        }
        
        var dest = destDic[sys._id];
        if(dest){

        }
    });


    /*var results = [];

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
    });*/

//typeof _self.Db == "undefined"  
  //  return results;
}
module.exports.Comparer =  function (){
   return {
        Spread : SpreadDiff  
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
