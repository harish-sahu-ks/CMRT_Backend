// Require library
var child_process = require("child_process");
console.log("compiled");
const express = require("express");
const multer = require("multer");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const fs = require("fs");
const reader = require("xlsx");
const XLSX = require("xlsx");
const decompress = require("decompress");
const Extracted_XLSX_folder = "./Extracted_XLSX_file";
const All_File_rows =  "./allFileRows"
const Result_folder = "./Result";
const path = require("path");
const excelfileReader = require("./excelfileReader")
const excelJs = require("exceljs");
const Role = require('./helper/role');
//const Blob = require('node:buffer');
var FileSaver = require('file-saver');
//const Blob  = require('buffer');
const uuid = require('uuid');
const jwt = require("jsonwebtoken");
const secretkey = "secretKey"
const authorization = require("./helper/authorize");
const authorize = require("./helper/authorize");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let count = 0;
let row = "";
let uniqueNumber = "";
const port = 4000;
let ConsolidatedFilePath = "";
let dataToPushResultXl1 = [];
let resultFileUniquePath = "";
let uniqueResultNumber = "";
let Name_of_ZipFile = "";

async function fileDetailAddinDatabase(uniqueNumber,uniqueResultNumber,Name_of_ZipFile,count,row){
  row = dataToPushResultXl1.length;
  // let timestamp = Date.now();
  if(row>0){
  let date_time = new Date();
  let date = ("0" + date_time.getDate()).slice(-2);
  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
  let year = date_time.getFullYear();
  let currentdate = year + "-" + month + "-" + date;
  fileDetailToAdd = {
  Date  : currentdate,
  ZipFileName : Name_of_ZipFile,
  ConsolidatedFileName : uniqueNumber,
  ResultFileName  : uniqueResultNumber,
  FileCount  : count,
  RowCount   : row
  }
  await db.cmrt_file_details.create(fileDetailToAdd);
  return fileDetailToAdd
}else{
  console.log("Incorrect file")
}
}

// app.post("/login",(req,res)=>{
//   const data = req.body;
//   const user = {
//     username:"admin",
//     password:"admin123"  
//   }
//   if(user.username==data[0].username && user.password==data[0].password){    
//     jwt.sign({user},secretkey,{expiresIn:'300s'},(err,token)=>{
//       res.json({
//         token
//       })
//     })
//   }else{
//     res.send("Invalid Password");
//   }
// })

// app.post('/profile',verifyToken,(req,resp)=>{
//   jwt.verify(req.token,secretkey,(err, authData)=>{
//    if(err){
//       resp.send({result:"Invalid token"})
//    }else{
//      resp.json({
//        message : "profile Accessed",
//      })
//    }
//   })
// })

// function verifyToken(req,resp,next){
//   const bearerHeader = req.headers['authorization'];
//   if(typeof bearerHeader !== 'undefined'){
//     const bearer = bearerHeader.split(" ")
//     const token = bearer[1];
//     req.token = token;
//     next();
//   }else{
//     resp.send({
//       result:'Token is not valid'
//     })
//   }
// }

app.put('/deleteUserDetail',authorize(),(req,res)=>{
  EmailListForDelete = [];
  EmailList = req.body
  console.log(EmailList)
  excelfileReader.deleteUserDetail(EmailList);
  res.json(req.body);
})

// app.put('/CheckedOrNot',(req,res)=>{
//   console.log(req.body.Email +""+ req.body.isSelect);
//   excelfileReader.CheckUserListRow(req.body.Email,req.body.isSelect);
//   res.json(req.body.isSelect);
// })

app.put('/updateEmail',authorize(),(req,res)=>{
  preEmail = req.body.Email;
  new_Email = req.body.new_Email;
  excelfileReader.editUserEmail(preEmail,new_Email);
  res.json("success")
})

app.post('/postUserListDetails',(req,res)=>{
  userdata = req.body
  // console.log(userdata[0].Name)
  storeuserDetails(userdata,res);
})

async function storeuserDetails(userdata,res){
   for(let i=0;i<userdata.length;i++){
    userDetailsToAdd = {
      Name : userdata[i].Name,
      Company : userdata[i].Company,
      Email : userdata[i].Email,
      Status : userdata[i].status,
      isSelect : false
    }
    await db.user_details.create(userDetailsToAdd);
   }
  // dont delete
  // getuserdetail(res);
}

app.get('/getuserDetailList',authorize(), getuserdetail);
async function getuserdetail(req,res){
  storedUserlist = await db.user_details.findAll({attribute : ['Name','Company','Email','Status','isSelect']});
  return res.json(storedUserlist);
}

app.get('/detailOfUploadedFileConsolidatedFileResultFile',authorize(),(req,res)=>{

  myFunc(req,res);
  
})

async function myFunc(req,res)
{
  
  storedDetail = await db.cmrt_file_details.findAll({attribute : [ 'Date', 'ZipFileName', 'ConsolidatedFileName','ResultFileName', 'FileCount', 'RowCount']});
    // storedDetail = await db.cmrt_file_details.findAll();
  return res.json(storedDetail);
}


app.post('/postdateandNameofZipFile/:FileName', (req, res)=>{
  // Date = req.body.Dateofupload;
  Name_of_ZipFile = req.params.FileName;
  res.send(Name_of_ZipFile);
})

app.get('/DownLoadUniqueFileData/:UniqueNumber',authorize(),(req,res)=>{
 const UniqueNumber = req.params.UniqueNumber
//  const ExistentFileName = './UniqueFile/uniquefile' + UniqueNumber  + '.xlsx' ;
 
// const uniqDATA = excelfileReader.filterResultFileTogetUniqueFile(UniqueNumber);
// const resultFileNumber = uniqDATA;
const options = {
    root: path.join(__dirname)
};
const fileName = './UniqueFile/uniquefile' + UniqueNumber + '.xlsx' ;
res.sendFile(fileName, options, function (err) {
    if (err) {
        // next(err);
    } else {
        console.log('Sent:', fileName);
    }
});
   
})

// app.get('/getNumberofFileAndRow/:ConsolidatedFileNumber', (req, res)=>{
//     //  excelfileReader.fetchFilteredDataFromAllFile(req.params.ConsolidatedFileNumber);
//      row = dataToPushResultXl1.length;
//      let NumberOfFileRow = {row : row, count : count};
//      res.json(NumberOfFileRow);
     
// })
let ConsolidatedFileNumber = '';
app.post('/getConsolidatedFileNumber/:ConsolidatedFileNumber',(req,res)=>{
  this.ConsolidatedFileNumber = req.params.ConsolidatedFileNumber;
  // ConsolidatedFileNumber = excelfileReader.getConsolidatedFileNumber(ConsolidatedFileNumber);
  excelfileReader.fetchFilteredDataFromAllFile(this.ConsolidatedFileNumber);
  res.json(this.ConsolidatedFileNumber)
})

app.put('/deleteGeneratefileanditsDetails',(req,res)=>{
   const ConsolidatedFileNum = req.body.consolidUniqNum;
   const resultFileNum = req.body.resultUniqueNum;
   const uniqfileNum = resultFileNum;
   console.log(ConsolidatedFileNum +"  "+ resultFileNum);
   let response = excelfileReader.deletefileAnditsdetail(ConsolidatedFileNum,resultFileNum,uniqfileNum);
   res.json(response);
        
})

app.post('/statusAndConsolidatedfileNumber',(req, res)=>{
  let ConsolidatedFileNum = this.ConsolidatedFileNumber;
  let SmelterStatus = req.body.SearchedKeyWord;
  let Smeltertype = req.body.Type;
  console.log(Smeltertype);
  console.log(Smeltertype +" "+SmelterStatus);
  if(SmelterStatus == ''){
     SmelterStatus = undefined;
  }else if(Smeltertype == ''){
     Smeltertype = undefined;
  }else{
     
  }
  excelfileReader.getdatabystatus(ConsolidatedFileNum,SmelterStatus,Smeltertype);
  let smelterList = [];
  for(let index = 0; index<excelfileReader.smelterListByStatus.length; index++){
    const element = excelfileReader.smelterListByStatus[index];
    // console.log(element);
    smelterList.push({
      "Supplier_Name": element.Supplier_Name,
      "Smelter_Id_Number": element.Smelter_Id_Number,
      "Metal": element.Metal,
    })
  }
 this.SmelterType = undefined;
 SmelterStatus = undefined;
 res.json(smelterList);
})

app.get('/getFilteredSmelterList/:SmelterId',authorize(),(req, res)=>{
  const SmelterId = req.params.SmelterId;
  const ConsolidatedFileNumber = req.body.consolidatedFileNumber;
  // excelfileReader.fetchFilteredDataFromAllFile(ConsolidatedFileNumber);
  this.SupplierList=[];
  for(let index=0; index<excelfileReader.filteredSmelterIdList.length; index++){
    const element = excelfileReader.filteredSmelterIdList[index];
    if(SmelterId==element.Smelter_Id_Number){
      this.SupplierList.push({
        "Supplier_Name": element.Supplier_Name,
        "Smelter_Id_Number": element.Smelter_Id_Number,
        "Metal": element.Metal,
        "RMI_Status" : element.RMI_Status,
        "Type" : element.Type,
        "Smelter_Reference" : element.Smelter_Reference,
        "country"  : element.country

      })
    }
  }
  res.json(this.SupplierList);
})

app.get('/getDetailsBySmelterRef/:SmelterRef',authorize(),(req, res,)=>{
      const SmelterRef = req.params.SmelterRef
      // res.send(id)
      this.SmelterfileDetail=[]
      for(let index =0; index<excelfileReader.cidAndDetailList.length; index++){
        const element = excelfileReader.cidAndDetailList[index];
        if(SmelterRef==element.SmelterRef){
        this.SmelterfileDetail.push({
          "SmelterId"  : element.SmelterId,
          "Type"       : element.Type,
          "RmiStatus"  : element.RmiStatus,
          "SmelterRef" : element.SmelterRef,
          "Country"    : element.Country,
          "Metal"      : element.Metal   
        })
      }
     }
      res.json(this.SmelterfileDetail);
})

app.get("/getCIDNumberAndDetails",authorize(), (req, res) => {
  
  this.SmelterfileDetail=[]

   for(let index =0; index<excelfileReader.cidAndDetailList.length; index++){
      const element = excelfileReader.cidAndDetailList[index];
      this.SmelterfileDetail.push({
        "SmelterId"  : element.SmelterId,
        "Type"       : element.Type,
        "RmiStatus"  : element.RmiStatus,
        "SmelterRef" : element.SmelterRef,
        "Country"    : element.Country,
        "Metal"      : element.Metal,    
      })
   }
    res.json(this.SmelterfileDetail);
});

app.get("/download",authorize(), async function (req, res) {
  fs.readFile("./resultInfo.txt", "utf8", function (err, data) {
    // Display the file content
    console.log(data);
    res.sendFile(path.resolve(data));
  });
});

app.post('/authenticate', authenticate);  

app.get('/testUrl', authorize(), testImpl); 

app.post('/initiateEmail',sendEmail);

app.post('/reinitiateEmali',reinitiateEmail);

async function sendEmail(req,res,next){
  storedUserlist = await db.user_details.findAll({attribute : ['Name','Company','Email','Status','isSelect']});
    userEmailList = [];
    for(let i=0;i<storedUserlist.length;i++){
      // userEmailList.push(storedUserlist[i].Email)
      element = storedUserlist[i];
      if(element.Email != null){
        await excelfileReader.sendEmailTo(element.Email)
      }
    }
    return res.json("success");
}

async function reinitiateEmail(req,res,next){
   EmailList = req.body;
   for(let i=0;i<EmailList.length;i++){
      Email = EmailList[i]
      await excelfileReader.sendEmailTo(Email);
   }
   return res.send("success");
}



function testImpl(req, res, next) {
  res.json("Vijay");
}

async function authenticatePrivateFunction(username, password ) {

  if(username == "admin" && password=="admin123")
  {
      //console.log(password);
     // const user = await db.User.scope('withHash').findOne({ where: { username } });

      // if (!user || !(await bcrypt.compare(password, user.hash)))
      //     throw 'Username or password is incorrect';

      console.log('Success');

      // authentication successful
      const token = jwt.sign({ sub: 1, role: "Admin", username:username }, 
        "JKJKJKJKJKJKGFFFF", { expiresIn: '7d' });
      //console.log(user.role);
      //const { hash, ...userWithoutPassword } = user;
      //return { userWithoutPassword, token };
      return { "token": token };
  }
  else
  {
    return null;
  }
}

function authenticate(req, res, next) {
  data = req.body
  password = data[0].password;
  username = data[0].username;
  authenticatePrivateFunction(username,password)
      .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
      .catch(err => {
          console.log(err);
          next(err)
      }
      ); 
}

app.get("/download/:resultFileNumber",authorize(), downloadFile);


async function downloadFile(req, res) {
  const resultFileNumber = req.params.resultFileNumber;
  const options = {
      root: path.join(__dirname)
  };

  const fileName = './Result/result' + resultFileNumber + '.xlsx' ;
  res.sendFile(fileName, options, function (err) {
      if (err) {
          // next(err);
      } else {
          console.log('Sent:', fileName);
      }
  });

  
}
app.get('/DownloadConsolidatedFile/:consolidatedFilePath',authorize(), function (req, res) {
  const consolidatedFileNumber = req.params.consolidatedFilePath;
  const options = {
      root: path.join(__dirname)
  };

  const fileName = './allFileRows/allFileRows' + consolidatedFileNumber + '.xlsx' ;
  res.sendFile(fileName, options, function (err) {
      if (err) {
          next(err);
      } else {
          console.log('Sent:', fileName);
      }
  });
});

app.get("/getResultFileData",authorize(), async function (req, res) {
  let resultFileDataList = [];
  fs.readFile("./resultInfo.txt", "utf8", function (err, data) {
    // Display the file content
    console.log(data);
    file = reader.readFile(data);
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
    for(let index=0; index<temp.length; index++){
      const element = temp[index];
      resultFileDataList.push({
        "Smelter_Name": element["Smelter_Name"],
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
    res.json(resultFileDataList);
  })
});

const storage = multer.diskStorage({
  destination: function (req, res, callback) {
    console.log("Destination is called.");
    callback(null, "./uploads/");
  },
  filename: function (req, res, callback) {
    console.log("Destination file is called.");
    callback(null, "example" + ".zip");
  },
});
const upload = multer({ storage: storage });

app.post("/multifileupload", upload.single("files"), function (req, res) {
  count=0;
  Extraction(res);
  console.log("Hi....");
 
});

function Extraction(res) {
  if (fs.existsSync("./uploads/example.zip")) {
    (async () => {
      try {
        const files = await decompress(
          "./uploads/example.zip",
          "Extracted_XLSX_file",
          {
            map: (file) => {
              file.path = `${file.path}`;
              // count++;
              return file;
            },
          }
        );

        try {
          fs.unlinkSync("./uploads/example.zip");
        } catch (error) {
          console.log("error occured; " + error);
        }

        let extractedFileArray = fs.readdirSync(Extracted_XLSX_folder, { withFileTypes: true });
        dataToPushResultXl1 = [];

        for (let i = 0; i < extractedFileArray.length; i++) {
          sourceFilePath = extractedFileArray[i].name;
          // file_Name = path.basename(sourceFilePath)
          // console.log(file_Name)
          count++
          mergeAndfilter(
            i,
            Extracted_XLSX_folder + "/" + sourceFilePath,
            i == extractedFileArray.length - 1
          );
        }
      uniqueNumber = uuid.v4();
      console.log(uniqueNumber);
      const ws = XLSX.utils.json_to_sheet(dataToPushResultXl1);
      const wb =  XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb,ws, "Responses");
      ConsolidatedFilePath = ".\\allFileRows\\allFileRows"+`${uniqueNumber}`+".xlsx"
      // ConsolidatedFilePathNumber = uniqueNumber;
      XLSX.writeFile(wb, ConsolidatedFilePath);
    
      } catch (error) {
        console.log(error);
      }
      res.send("Successfull");
      // excelfileReader.fetchFilteredDataFromAllFile();
        // save file Detail in database
     fileDetailAddinDatabase(uniqueNumber,uniqueResultNumber,Name_of_ZipFile,count,row);
    })();
  }
}

function mergeAndfilter(i, sourceFilePath, isLastFile) {
  console.log(i);
  compareSmelterFilesAndCreateResultFile(
    sourceFilePath,
    ".\\Result\\result" + `${i}` + ".xlsx",
    ".\\Result\\result" + `${i + 1}` + ".xlsx",
    isLastFile
  );

// store result in text file
  if (isLastFile) {
    fs.writeFile(
      "./resultInfo.txt",
      ".\\Result\\result" + `${uniqueResultNumber}` + ".xlsx",
      (err) => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      }
    );
  }

  // Delete after merge
  if (fs.existsSync(sourceFilePath)) {
    fs.unlink(sourceFilePath, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("deleted");
    });
  }
  
}
function isBetterData(data1, data2) {
  count1 = 0;
  count2 = 0;
  for (let index = 1; index < 18; index++) {
    const element = data1[index];
    if (element != undefined) {
      count1++;
    }
  }

  for (let index = 1; index < 18; index++) {
    const element = data2[index];
    if (element != undefined) {
      count2++;
    }
  }
  return count1 > count2;
}

function findInArray(isSrcFile, array, data) {
  let foundInArray = false;
  row = -1;
  dataToRet = undefined;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    let indexOffset = isSrcFile ? 1 : 0;

    const metalFromArray = element[indexOffset+1];
    const metalFromData = data[2];
    const smelterLookUpFromArray = element[indexOffset+2];
    const smelterLookUpFromData = data[3];
    const smelterNameFromArray = element[indexOffset+3];
    const smelterNameFromData = data[4];
    const smelterCountryFromArray = element[indexOffset+4];
    const smelterCountryFromData = data[5];
    const smelterIdFromArray = element[indexOffset+5];
    const smelterIdFromData = data[6];

    // if (isSrcFile && index == 0) {
    //   console.log("Hello");
    //   // Ignore
    // } else
     if (metalFromArray == metalFromData && smelterLookUpFromArray == smelterLookUpFromData && smelterNameFromArray == smelterNameFromData
       && smelterCountryFromArray == smelterCountryFromData
      &&smelterIdFromArray == smelterIdFromData) {
      foundInArray = true;
      row = index;
      dataToRet = element;
      break;
    }
  }
  return { flag: foundInArray, row: row, data: dataToRet };
}
function compareSmelterFilesAndCreateResultFile(
  sourceFilePath,
  previousResultFilePath,
  resultfilePathPath,
  isLastFile
) {
  console.log(
    "Comparing file " + sourceFilePath + " and file " + previousResultFilePath
  );

  var srcFile_name = path.basename(sourceFilePath);
  console.log(srcFile_name);
  const file1 = XLSX.readFile(sourceFilePath);
  const sheets1 = file1.SheetNames;

  const file2 = XLSX.readFile(previousResultFilePath);
  const sheets2 = file1.SheetNames;
  var file_Name = path.basename(previousResultFilePath);

  if (sheets1.length >= 5) {
    smelterSheetFromExistingFile = file2.Sheets[file2.SheetNames[0]];
    smelterSheetFromSourceFile = file1.Sheets[file1.SheetNames[4]];
    let resultArray = [];
    let resultArray1 = []; 
    let rmiList = [];

    rmiFilePath = 'Upload_file/RMI List.xlsx' ;
    var rmiFile_Name = path.basename(rmiFilePath);
    const rmifile = XLSX.readFile(rmiFilePath);
    const rmiSheet = rmifile.SheetNames;
    rmiSmelterSheet = rmifile.Sheets[rmifile.SheetNames[2]];

    AnalyzeAndFillRmiList(
      rmiSmelterSheet,
      rmiList,
      rmifile,
      0,
      2
    );

    AnalyzeAndFillArray(
      smelterSheetFromExistingFile,
      resultArray,
      undefined,
      file2,
      2,
      0
    );
    AnalyzeAndFillArray(
      smelterSheetFromSourceFile,
      resultArray,
      srcFile_name,
      file1,
      5,
      4
    );

    AnalyzeAndFillArray1(
      smelterSheetFromSourceFile,
      resultArray1,
      srcFile_name,
      file1,
      5,
      4,
      rmiList
    );

    if(resultArray1.length > 0){
      
      for(let index=0; index<resultArray1.length;index++){
        
        let rowData = {
          Supplier_Name: resultArray1[index][0],
          Smelter_Id_Number: resultArray1[index][1],
          Metal: resultArray1[index][2],
          Smelter_LookUp: resultArray1[index][3],
          SmelterName: resultArray1[index][4],
          SmelterCountry: resultArray1[index][5],
          Smelter_Identification: resultArray1[index][6],
          Source_Of_Smelter_ID_Number: resultArray1[index][7],
          Smelter_Street: resultArray1[index][8],
          Smelter_City: resultArray1[index][9],
          Smelter_Fecility_Location: resultArray1[index][10],
          Smelter_ContactName: resultArray1[index][11],
          Smelter_Contact_Email: resultArray1[index][12],
          Proposed_Next_steps: resultArray1[index][13],
          Name_of_Mines: resultArray1[index][14],
          Location_Of_Mine: resultArray1[index][15],
          Smelters_FeedStack: resultArray1[index][16],
          Comments: resultArray1[index][17],
          RMI_Status: resultArray1[index][18], 
          Type : resultArray1[index][19]
        }
        dataToPushResultXl1.push(rowData);
      
    }
    
    if (resultArray.length > 0) {
      let dataToPushResultXl = [];
      for (let index = 0; index < resultArray.length; index++) {
        let rowData = {
          // Smelter_Name: resultArray[index][0],
          Smelter_Id_Number: resultArray[index][0],
          Metal: resultArray[index][1],
          Smelter_LookUp: resultArray[index][2],
          SmelterName: resultArray[index][3],
          SmelterCountry: resultArray[index][4],
          Smelter_Identification: resultArray[index][5],
          Source_Of_Smelter_ID_Number: resultArray[index][6],
          Smelter_Street: resultArray[index][7],
          Smelter_City: resultArray[index][8],
          Smelter_Fecility_Location: resultArray[index][9],
          Smelter_ContactName: resultArray[index][10],
          Smelter_Contact_Email: resultArray[index][11],
          Proposed_Next_steps: resultArray[index][12],
          Name_of_Mines: resultArray[index][13],
          Location_Of_Mine: resultArray[index][14],
          Smelters_FeedStack: resultArray[index][15],
          Comments: resultArray[index][16],
        };
        dataToPushResultXl.push(rowData);
      }
      if(isLastFile){
      uniqueResultNumber = uuid.v4();
      resultFileUniquePath = ".\\Result\\result"+`${uniqueResultNumber}`+".xlsx"
      console.log("resultFileUniquePath :" + resultFileUniquePath);
      const ws = XLSX.utils.json_to_sheet(dataToPushResultXl);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Responses");
      XLSX.writeFile(wb, resultFileUniquePath);
      excelfileReader.filterResultFileTogetUniqueFile(uniqueResultNumber);
    }else{
      const ws = XLSX.utils.json_to_sheet(dataToPushResultXl);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Responses");
      XLSX.writeFile(wb, resultfilePathPath);
    }
    }
    console.log("=========================================================");
  }
}

}
  function AnalyzeAndFillArray(
    smelterSheet,
    resultArray,
    srcFile_name,
    file,
    rowStartIndex,
    sheetIndex
  ) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let isSrcFile = srcFile_name != undefined;
    if (smelterSheet.hasOwnProperty("!ref")) {
      var range = XLSX.utils.decode_range(smelterSheet["!ref"]);
      let lastRow = range.e.r;
      console.log("lastRows: " + lastRow);
         let columnOffset = 0
      for (i = rowStartIndex; i < lastRow + rowStartIndex; i++) {
        data = [];
        index1 = letters.charAt(columnOffset) + i;
        index2 = letters.charAt(5) + i;
        testData1 = file.Sheets[file.SheetNames[sheetIndex]][index1];
        testData2 = file.Sheets[file.SheetNames[sheetIndex]][index2];
        if (testData2 != undefined && testData2.v != '') {
          index1 = letters.charAt(columnOffset) + i;
          let numberOfCols = 17
          let indexOffset = 0
          for (let index = 0; index < numberOfCols; index++) {
            index1 = letters.charAt(index) + i;

            tempCellData = file.Sheets[file.SheetNames[sheetIndex]][index1]; 
                                     
              if (tempCellData != undefined) {
                if(index==7){
                     if(tempCellData.v==0){
                      data[index + indexOffset] = '';
                     }else{
                      data[index + indexOffset] = tempCellData.v;
                     }
                }else{
                  data[index + indexOffset] = tempCellData.v;
                }
              }
            
          }
          found = findInArray(isSrcFile, resultArray, data);
          if (found.flag == false) {
            resultArray.push(data);
          } else {
            if (isBetterData(data, found.data)) {
              resultArray[found.row] = data;
            }
          }
        } else {
          break;
        }
      }
    }
  }
// }
// Read and Store RMI_file data into rmiList
function AnalyzeAndFillRmiList(
  rmiSmelterSheet,
  rmiList,
  rmifile,
  rowStartIndex,
  sheetIndex
  ){
     const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     if(rmiSmelterSheet.hasOwnProperty("!ref")){
      var range = XLSX.utils.decode_range(rmiSmelterSheet["!ref"]);
      let lastRow = range.e.r;
      let columnOffset = 4;
      for(i=rowStartIndex; i<lastRow; i++){
          data = []
          index1 = letters.charAt(columnOffset) + i;
          testData = rmifile.Sheets[rmifile.SheetNames[sheetIndex]][index1];
          if(testData != undefined){
            // index1 = letters.charAt(columnOffset) + i;
            let numberOfCols = 9;
            for(let index=0; index<numberOfCols; index++){
              index1 = letters.charAt(index)+i;
              tempCellData1 = rmifile.Sheets[rmifile.SheetNames[sheetIndex]][index1];
              if(tempCellData1 != undefined){
                data[index] = tempCellData1.v
              }
            }
          }
          rmiList.push(data);
      }
     }
}

// only merge, all files data collecting togather in a single file

function AnalyzeAndFillArray1(
  smelterSheet,
  resultArray1,
  srcFile_name,
  file,
  rowStartIndex,
  sheetIndex,
  rmiList
){
  
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if(smelterSheet.hasOwnProperty("!ref")){
   var range = XLSX.utils.decode_range(smelterSheet["!ref"]);
   let lastRow = range.e.r;
   console.log("lastrow:"+lastRow);
   let columnOffset = 0;
   for(let i=rowStartIndex;i<lastRow+sheetIndex;i++){
     data = [];
    let index0 = letters.charAt(columnOffset)+i;
    let index00 = letters.charAt(5)+i;
     let testData1 = file.Sheets[file.SheetNames[sheetIndex]][index0];
     let testData2 = file.Sheets[file.SheetNames[sheetIndex]][index00];
      
     if(testData2 != undefined && testData2.v != ''){
       // index1 : letters.charAt(columnOffset)+i;
       let numberOfColumns = 18;
       let indexOffset1 = 1;
       for(let index = 0; index < numberOfColumns; index++){
          let index1 = letters.charAt(index)+i;
          let  index2 = letters.charAt(5)+i;
          let tempCellData1 = file.Sheets[file.SheetNames[sheetIndex]][index2];
          let tempCellData = file.Sheets[file.SheetNames[sheetIndex]][index1];
           if(index==0){
             if(tempCellData == undefined && tempCellData1.v != ''){
                data[0] = srcFile_name;
                data[1] = '';
             }else if(tempCellData != undefined && tempCellData1.v != '' ){
              data[0] = srcFile_name;
              data[1] = tempCellData.v;
             }
             else{
                console.log(tempCellData.v +' '+srcFile_name);
                break;
             }
           };
           if(tempCellData != undefined && index != 0) {    
            if(index==7){
              if(tempCellData.v==0){
               data[index + indexOffset1] = '';
              }else{
               data[index + indexOffset1] = tempCellData.v;
              }
         }else{
               data[index + indexOffset1] = tempCellData.v;
             }  
          }
          if(index==17){
             for(let j=0;j<rmiList.length; j++){
               if(data[6]==rmiList[j][4]){
                 data[index+indexOffset1] = rmiList[j][7];
                 data[index+indexOffset1+indexOffset1] = rmiList[j][8];
                 break;
               }else{
                 data[index+indexOffset1] = "Smelter Not Listed In RMI file";
                 data[index+indexOffset1+indexOffset1] = "Smelter Not Listed In RMI file";
               }
             }
           }

           }
           resultArray1.push(data);
       }else{
       break;
       }
     }
     console.log("files length : "+ resultArray1.length);
   }
 }


app.listen(port, () => {
  console.log("App is running on localhost:" + port);
})

