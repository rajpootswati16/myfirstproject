var express = require('express');
var pool = require('./pool');
var router = express.Router();

router.get("/loginpage", function(req,res){
    res.render('login', {message:''})

})

router.post("/chk_admin_login",function(req,res){
    pool.query("SELECT * FROM books.admins where (emailid=? or mobileno=?) and password=?", [req.body.emailid,req.body.emailid,req.body.password], function(error,result){
        if(error){
            res.render('login',{message:'Server Error....'})
        }
        else{
            if(result.length==0){
                res.render('login',{message:'Invalid Username or Password'})
            }
            else{
                res.render('dashboard')
            }
        }
    })
})

module.exports = router;
