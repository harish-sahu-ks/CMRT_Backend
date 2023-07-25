<<<<<<< HEAD
const express = require("express");
const jwt = require("Jsonwebtoken");
const router = express.Router();

router.get("/login",(req,resp)=>{
    resp.json({
        Messaage : "Logedin"
    })
})
=======
const express = require("express");
const jwt = require("Jsonwebtoken");
const router = express.Router();

router.get("/login",(req,resp)=>{
    resp.json({
        Messaage : "Logedin"
    })
})
>>>>>>> aa5ca6a36981cd089e84cf971ec88ea472221b43
module.exports = router;