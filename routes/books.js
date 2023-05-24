var express = require('express');
var pool = require('./pool');
var upload= require('./multer');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

/* GET use to show Book interface*/
router.get('/bookinterface', function(req, res, next) {
    try{var admin= localStorage.getItem('ADMIN')
    console.log(admin)
    if(admin){
        res.render('bookinterface',{status:-1, message:''})
    }
    else{
        res.render('login',{message:''})
    }
  
}
catch(e){
    res.render('login',{message:''})
}
    

})  

router.get('/fetch_all_subjects', function(req,res){
    pool.query("SELECT * FROM books.subjects", function(error,result){
        if(error){
            res.status(500).json([])
        }
        else{
            res.status(200).json(result)
        }
    })
})

router.get('/fetch_all_titles', function(req,res){
    pool.query("SELECT * FROM booktitle where subjectid=?",[req.query.subjectid], function(error,result){
        if(error){
            res.status(500).json([])
        }
        else{
            res.status(200).json(result)
        }
    })
})

router.post('/submit_book_details', upload.single('poster'),  function(req,res){
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)

    pool.query("insert into books.bookdetails (subjectid,titleid,author,publisher,price,offer,status,poster)values(?,?,?,?,?,?,?,?)",[req.body.subjectid,req.body.titleid,req.body.author,req.body.publisher,req.body.price,req.body.offer,req.body.status,req.file.originalname], function(error,result){

        if(error){
            console.log(error)
            res.render('bookinterface',{status:0, message:'Server Error...'})
        }

        else{
            res.render('bookinterface',{status:1,message:'Record Submitted Successfully....'})
        }
    })
})

/* This API is to display all Books Data */
router.get('/fetch_all_books', function(req,res){
    pool.query("select BD.*,(select BS.subjectname from subjects BS where BS.subjectid=BD.subjectid) as subjectname, (select BT.titlename from booktitle BT where BT.titleid=BD.titleid) as title  from bookdetails BD", function(error,result){
        if(error){ console.log(error)
            res.render('displayallbooks', {data:[]})
        }
        else{ console.log(result)
            res.render('displayallbooks', {data:result})
        }
    })
})

router.get('/edit_book_data', function(req,res){
    console.log(req.query)
    pool.query("select BD.*,(select BS.subjectname from subjects BS where BS.subjectid=BD.subjectid) as subjectname, (select BT.titlename from booktitle BT where BT.titleid=BD.titleid) as title from bookdetails BD where BD.bookid=?",[req.query.bookid], function(error,result){
        if(error){ console.log(error)
            res.render('displaybyid', {data:[]})
        }
        else{ console.log(result)
            res.render('displaybyid', {data:result[0]})
        }
    })
})

router.post('/edit_book_details', function(req,res){
    
if(req.body.btn=="Edit"){
    pool.query("update books.bookdetails set subjectid=?,titleid=?,author=?,publisher=?,price=?,offer=?,status=? where bookid=?",[req.body.subjectid,req.body.titleid,req.body.author,req.body.publisher,req.body.price,req.body.offer,req.body.status,req.body.bookid], function(error,result){

        if(error){
            console.log(error)
            res.redirect('/books/fetch_all_books')
        }

        else{
            res.redirect('/books/fetch_all_books')
        }
    })
}
else{
    pool.query("Delete from books.bookdetails where bookid=?",[req.body.bookid], function(error,result){

        if(error){
            console.log(error)
            res.redirect('/books/fetch_all_books')
        }

        else{
            res.redirect('/books/fetch_all_books')
        }
    })
}
    
})

router.get('/displayposter', function(req,res) {
    res.render('displayposter',{data:req.query})
   
  })

router.post('/edit_poster', upload.single('poster'), function(req,res){

    pool.query("update books.bookdetails set poster=? where bookid=?",[req.file.originalname,req.body.bookid], function(error,result){

        if(error){
            console.log(error)
            res.redirect('/books/fetch_all_books')
        }

        else{
            res.redirect('/books/fetch_all_books')
        }
    })
})  

module.exports = router;
