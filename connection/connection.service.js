const reader = require('xlsx')

module.exports = {

};

let cidAndDetailList = [];
module.exports = {
    cidAndDetailList
}

initialize();
 function initialize(){
    fetchDataofCIDNumberAndDetailsList();
 }

 function fetchDataofCIDNumberAndDetailsList(){
    file = reader.readFile('../Upload_file/RMI List.xlsx');
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    for(let index=0; index<temp.length; index++){
        const element = temp[index];
        cidAndDetailList.push({
            "SmelterId"  : element["SMELTER ID"],
            "Type"       : element["Type"],
            "RmiStatus"  : element["RMI Status"],
            "SmelterRef" : element["SMELTER REFERENCE"],
            "Country"    : element["COUNTRY"],
            "Metal"      : element["METAL"],    
        })
    }
    return cidAndDetailList;
 }