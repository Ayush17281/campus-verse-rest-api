
//MIDDLEWARES
const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();
const    {v4 : uuidv4} = require("uuid") ;
// Settin up a local Server 
const app = express();
//Communication end point between client and Server 
const port = process.env.PORT || 8080  ;

//parse the data
app.use(express.urlencoded({extended:true})) ;


//REQUIRE oVERRIDE PACKAGE
var methodOverride = require('method-override')
app.use(methodOverride('_method'))


// VIEWS
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
 //Public 
 app.use(express.static(path.join(__dirname,"public")));

//DATABASE
const connection = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   database : process.env.DB_NAME,
   password : process.env.DB_PASSWORD,
   port : process.env.DB_PORT,
   ssl : {
      rejectUnauthorized : false
   }
});
// Test the connection 
connection.connect((err)=>{
   if(err) {
      console.log(err);
      return ;
   }
   console.log("MySQL Connected Successfully ! ! !");
}) ;




//ROUTES
 //Home Route
 app.get("/", (req, res) => {
    res.redirect("/posts");
});
app.get("/posts", (req,res) => {
   let q = "SELECT * FROM posts ORDER BY created_at DESC";
   connection.query(q,(err,result)=>{
      if(err){
         console.log(err);
         return;
      }
      else{
         res.render("index.ejs",{posts : result});
      }
   })
})

//Route to create new post 
 app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
 })

 app.post("/posts",(req,res) => {
    let {username , content} = req.body ; 
    let id = uuidv4() ;
    let q = `INSERT INTO posts(id, username, content) VALUES (?,?,?)`;
   connection.query(q,[id,username,content],(err,result)=>{
      if(err){
         console.log(err);
         return;
      }
      else{
         res.redirect('/posts');
      }
   })
 })  ;

 //Get to the Specific Post 
 app.get("/posts/:id",(req,res)=>{
   let {id} = req.params;
   let q = `SELECT * FROM posts WHERE id=?` ;
   connection.query(q,[id],(err,result)=>{
      if(err){
         console.log(err) ;
         return ;
      }
      else{
         res.render("show.ejs" ,{post:result[0]}) ;  // result always stores the data in list--->>JS Object literal hence post will be a Object   
      }
   })
 })

 //Edit server data partially using patch request 

app.get('/posts/:id/edit',(req,res)=>{
   let {id} = req.params;
   let q = "SELECT * FROM posts WHERE id=?" ;
   connection.query(q,[id],(err,result) => {
      if(err){
         console.log(err);
      }
      else{
         res.render('edit.ejs',{post:result[0]});
      }
   })
})

 app.patch('/posts/:id',(req,res)=>{
   let {id} = req.params;
   let newcontent = req.body.content ;
  
         let q = `UPDATE posts SET CONTENT = ? WHERE id=?`;
         connection.query(q,[newcontent,id],(err,result)=>{
            if(err){
               console.log(err);
            }
            else {
 res.redirect("/posts");
            }
   });
 }) ; 
///

/// Delet  a Post 
app.delete('/posts/:id',(req,res) => {
   let {id} = req.params;
   let q = `DELETE FROM posts WHERE id=?`;
   connection.query(q,[id],(err,result)=>{
         if(err) {
            console.log(err); 
         }
         else{
            res.redirect("/posts"); 
         }
   }) 
})


//CODE 
app.listen(port, ()=>{
    console.log(`App is Listening on the port ${port} `); 
})