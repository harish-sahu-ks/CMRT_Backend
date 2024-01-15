const express = require('express');
const connectionService = require('./connection.service')
const router = express.Router();



router.get('/getCIDNumberAndDetails',getCidNumberAndDetails);


module.exports = router;




// function postFileDetails(req,res,next){
//     filesDetail = req.body.filesDetail
//     connectionService.postfiledetails(filesDetail)
//     .then(()=>
//         console.log(filesDetail)
        
//         )
//     .catch(err=>{
//         console.log(err);
//         next(err)
//     })    
       
// }

function getCidNumberAndDetails(req, res, next){
   SmelterfileDetail=[]

   for(let index; index<connectionService.cidAndDetailList.length; index++){
      const element = connectionService.cidAndDetailList[index];
      this.SmelterfileDetail.push({
        "SmelterId"  : element.SmelterId,
        "Type"       : element.Type,
        "RmiStatus"  : element.RmiStatus,
        "SmelterRef" : element.SmelterRef,
        "Country"    : element.Country,
        "Metal"      : element.Metal,    
      })
   }
    res.json(SmelterfileDetail);
}

