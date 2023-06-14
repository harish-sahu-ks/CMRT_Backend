const reader = require('xlsx')
const fs = require('fs')
const indeX = require('./index')
const XLSX = require('xlsx')
const uuid = require('uuid')
const db = require("./db");

let cidAndDetailList = [];
let filteredSmelterIdList = [];
let rmiSmelterLookupData = [];
module.exports = {
    cidAndDetailList,
    filteredSmelterIdList,
    fetchFilteredDataFromAllFile,
    filterResultFileTogetUniqueFile,
    deleteUserDetail,
    editUserEmail,
    CheckUserListRow
    
}

initialize()
 function initialize(){
    fetchDataofCIDNumberAndDetailsList();
    rmiSmelterLookupFunction();
    // fetchFilteredDataFromAllFile();
 }

 function rmiSmelterLookupFunction(){
  while(rmiSmelterLookupData.length>0){
      rmiSmelterLookupData.pop()
  }

  file = reader.readFile('Upload_file/RMI_List0.xlsx');
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[3]]);
  for(let index=0; index<temp.length; index++){
    const element = temp[index];
    rmiSmelterLookupData.push({
        "Metal"      : element["METAL"],    
        "Smelter_Look-up" : element["Smelter Look-up (*)"],
        "Standard_Smelter_Names"    : element["Standard Smelter Names"],
        "Country"  : element["Smelter Facility Location: Country"],
        "Smelter_Id"  : element["Smelter ID"],
        "Source_of_Smelter_Identification_Number"       : element["Source of Smelter Identification Number"],
        "Smelter_Street "  : element["Smelter Street "],
        "Smelter_City"  : element["Smelter City"],
        "Location"  : element["Smelter Facility Location: State / Province"],
    })
}
return rmiSmelterLookupData;

 }


 function fetchDataofCIDNumberAndDetailsList(){
     while(cidAndDetailList.length>0){
        cidAndDetailList.pop()
     }

    file = reader.readFile('Upload_file/RMI List.xlsx');
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[2]]);
    for(let index=0; index<temp.length; index++){
        const element = temp[index];
        cidAndDetailList.push({
            "Metal"      : element["METAL"],    
            "SmelterRef" : element["SMELTER REFERENCE"],
            "Country"    : element["COUNTRY"],
            "SmelterId"  : element["SMELTER ID"],
            "RmiStatus"  : element["RMI Status"],
            "Type"       : element["Type"],
        })
    }
    return cidAndDetailList;
 }


let ConsolidatedFileUniquePath = "";

 function fetchFilteredDataFromAllFile(ConsolidatedFileNumber){
    ConsolidatedFileUniquePath = 'allFileRows/allFileRows'+ ConsolidatedFileNumber +'.xlsx'
     while(filteredSmelterIdList.length>0){
        filteredSmelterIdList.pop();
     }
    file = reader.readFile(ConsolidatedFileUniquePath);
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
    for(let index=0; index<temp.length; index++){
        const element = temp[index];
        filteredSmelterIdList.push({
            "Smelter_Name": element["Smelter_Name"],
            "Smelter_Id_Number": element["Smelter_Id_Number"],
            "Metal": element["Metal"],
        })

    }
    return filteredSmelterIdList;
 }
let isSmelterListed = false;
let isSmelterNotListed = false;
let userList = [];
let uniqueList = [];
let isNotMatched = false;
let isMatched = false;
let userCount = 0;
let uniqueCount = 0;
function filterResultFileTogetUniqueFile(UniqueNumber){
  while(uniqueList.length>0){
        uniqueList.pop();
     }
  FileToRead = 'Result/result'+UniqueNumber+'.xlsx';
  file = reader.readFile(FileToRead);
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  for(let index=0; index<temp.length;index++){
    const element = temp[index];
     for(let index1=0; index1<rmiSmelterLookupData.length;index1++){
          const elements = rmiSmelterLookupData[index1];
          if(element.Smelter_Id_Number != elements.Smelter_Id){
            isSmelterNotListed = true;
          }
          else if(element.Smelter_Id_Number == elements.Smelter_Id){
            isSmelterListed = true;
            isSmelterNotListed = false;
            break;
          }
          else{

          }
     }
     if(isSmelterListed==true && isSmelterNotListed==false){
        userList.push({
            // "Smelter_Name": element["Smelter_Name"],
            "Smelter_Id_Number": element["Smelter_Id_Number"],
            "Metal": element["Metal"],
            "Smelter_LookUp":element["Smelter_LookUp"],
            "SmelterName": element["SmelterName"],
            "SmelterCountry": element["SmelterCountry"],
            "Smelter_Identification": element["Smelter_Identification"],
            "Source_Of_Smelter_ID_Number": element["Source_Of_Smelter_ID_Number"],
            "Smelter_Street": element["Smelter_Street"],
            "Smelter_City": element["Smelter_City"],
            "Smelter_Fecility_Location": element["Smelter_Fecility_Location"],
            "Smelter_ContactName": element["Smelter_ContactName"],
            "Smelter_Contact_Email": element["Smelter_Contact_Email"],
            "Proposed_Next_steps": element["Proposed_Next_steps"],
            "Name_of_Mines": element["Name_of_Mines"],
            "Location_Of_Mine": element["Location_Of_Mine"],
            "Smelters_FeedStack": element["Smelters_FeedStack"],
            "Comments":element["Comments"],
        })
     }
    else if(isSmelterNotListed){
         userList.push({
             // "Smelter_Name": element["Smelter_Name"],
             "Smelter_Id_Number": element["Smelter_Id_Number"],
             "Metal": element["Metal"],
             "Smelter_LookUp":"Smelter Not Listed",
             "SmelterName": element["SmelterName"],
             "SmelterCountry": element["SmelterCountry"],
             "Smelter_Identification": element["Smelter_Identification"],
             "Source_Of_Smelter_ID_Number": element["Source_Of_Smelter_ID_Number"],
             "Smelter_Street": element["Smelter_Street"],
             "Smelter_City": element["Smelter_City"],
             "Smelter_Fecility_Location": element["Smelter_Fecility_Location"],
             "Smelter_ContactName": element["Smelter_ContactName"],
             "Smelter_Contact_Email": element["Smelter_Contact_Email"],
             "Proposed_Next_steps": element["Proposed_Next_steps"],
             "Name_of_Mines": element["Name_of_Mines"],
             "Location_Of_Mine": element["Location_Of_Mine"],
             "Smelters_FeedStack": element["Smelters_FeedStack"],
             "Comments":element["Comments"],
         })
         
     }else{

     }
  }

//   while(uniqueList.length>0){
//     uniqueList.pop();
//  }
  for(let i=0; i<userList.length;i++){
        const element1 = userList[i]
    for(let j=0; j<uniqueList.length;j++){
        const element2 = uniqueList[j]
        let  userSmelterid = element1.Smelter_Id_Number;
        let  uniqSmelterId = element2.Smelter_Id_Number;
       if(i==0){
        // uniqueList.push(userList[i])
        break
       }
      else if (userSmelterid != uniqSmelterId && i != 0){
          isNotMatched = true;
          isMatched = false
       }
       else{
           isMatched = true;
           for(let k=0; k<18; k++){
              if(userList[i][k] != undefined){
                 userCount++;
              }
              if(uniqueList[j][k] != undefined){
                uniqueCount++;
              }
            }
            if(userCount>uniqueCount){
              uniqueList[j] = userList[i]
            }
            break;
       }
    }
    if(i==0){
        uniqueList.push(userList[i])
       }
    else if(isNotMatched == true && isMatched == false){
        uniqueList.push(userList[i])
    }else{
      console.log(i)
    }
  }
    const ws = XLSX.utils.json_to_sheet(uniqueList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Response");
    uniqueFilePath = ".\\UniqueFile\\uniquefile" + `${UniqueNumber}` + ".xlsx";
    XLSX.writeFile(wb,uniqueFilePath)
   
  return UniqueNumber;
}

async function deleteUserDetail(EmailList){
   for(let i=0; i<EmailList.length; i++){
    if(db.user_details){
        const row = await db.user_details.findOne({
          where : {Email:EmailList[i]}
        })
        if(row){
          await row.destroy();
        }else{
          break;
        }
    }
   }
    }
async function editUserEmail(preEmail,new_Email){
    const row = await db.user_details.findOne({
      where : {Email : preEmail}
    })
    if(row){
      row.Email = new_Email;
      row.save();
    }
}

async function CheckUserListRow(email,isSelected){
  const row = await db.user_details.findOne({
    where : {Email : email}
  })
  if(row){
    row.isSelect = isSelected;
    row.save();
  }
}


 