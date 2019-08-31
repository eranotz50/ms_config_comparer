
function SpreadDiff(systemInstruments,sourceInstruments,destInstruments){

    sourceInstruments = sourceInstruments.filter(i => i._t === "AggregatedOutputInstrument");
    destInstruments = destInstruments.filter(i => i._t === "AggregatedOutputInstrument");
    systemInstruments = systemInstruments.filter(i => i._t === "AggregatedSystemInstrument");

    var sourceDic = ToDictionary(sourceInstruments, "SystemInstrument");
    var destDic = ToDictionary(destInstruments, "SystemInstrument");

    var results = [];   

    systemInstruments.forEach(sys => {
        
        var res = { Symbol : sys.Name};

        var source = sourceDic[sys._id];    
        if(source){

            if(source.Spread && source.Spread != null){
                res[source.OutputGroupName] = source.Spread._t;    
            }            
        }
        
        var dest = destDic[sys._id];
        if(dest){

            if(dest.Spread && dest.Spread != null){
                res[dest.OutputGroupName] = dest.Spread._t;
            }
        }

        results.push(res);
    });

    return results;
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

    return dic;
}
