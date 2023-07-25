const express = require("express");
const jwt = require("Jsonwebtoken");
const router = express.Router();

router.get("/login",(req,resp)=>{
    resp.json({
        Messaage : "Logedin"
    })
})
module.exports = router;