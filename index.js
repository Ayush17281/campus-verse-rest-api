const express = require("express");

const    {v4 : uuidv4} = require("uuid") ;


// Settin gup a local Server 
const app = express();
//Communication end point between client and Server 
const port = 8080 ;

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


let posts = [
{  
    id: uuidv4(),
    username : "TheCampusGuy" ,
    content :"Attendance at VIT Pune: Most faculties expect you to maintain at least 75% attendance, and for labs, 100% attendance is generally expected if you want to appear for the practicals. Some faculties may be a little flexible, but don't depend on that. If you want a smooth semester and good academics, keep an eye on your attendance from the beginning rather than trying to manage it at the end."  
},
{
id: uuidv4(),
username : "MidnightCoder" ,
content : "College Fests: Don't spend your entire college life attending lectures and going back to your room. The college fests are a good chance to take a break, participate in events and meet people outside your usual friend circle. Even if you're not participating in anything, go around and experience the fest. You'll probably have some good memories from it."
} ,
{
id: uuidv4(),
username : "ChaiAndChapters",
content: "Canteens at VIT Pune: There are two main canteens for students and a separate canteen for the staff. The student canteens are usually the places you'll end up visiting between lectures, especially when you have a short break. Try both and find your usual spot. Just don't let those 'five-minute breaks' turn into half-hour breaks.",
},

{
id: uuidv4(),
username : "SilentScholar",
content: "Reading Hall: The reading hall is probably one of the best places on campus for self-study. If you find it difficult to concentrate in your room or hostel, give it a try. During exams it can get busy, so getting into the habit of studying there early is much better than discovering it a week before your exams.",
},


{
id: uuidv4(),
username : "CampusExplorer",
content: "Campus Size: The campus is relatively small, especially when you compare it with some other colleges. You might notice it pretty quickly after joining. But honestly, there's an advantage to it — most places are easily accessible and you don't have to spend half your day walking from one end of campus to another.",
},


{
id: uuidv4(),
username : "CuriousMind",
content: "Research Exposure: Try getting familiar with research papers and journals early in college. Your first few papers might look completely confusing, and that's normal. Start with topics you're actually interested in and slowly learn how papers are structured and how researchers solve problems. This will help you a lot when you start working on serious projects later.",
},


{
id: uuidv4(),
username : "BeyondTheClassroom",
content: "College Clubs: VIT has a good mix of technical and non-technical clubs. Don't think you need to be an expert before joining one. Clubs are actually where you learn a lot of things outside the classroom, meet seniors and work with people from different branches. Try a few things in your first year and then stick with the ones you genuinely enjoy.",
}
];

 //Home Route
 app.get("/posts",(req,res) => {
    res.render("index.ejs",{posts}); 
 })

 app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
 })

 app.post("/posts",(req,res) => {
    let {username , content} = req.body ; 
    let id = uuidv4() ;
    posts.push({id,username,content});
    res.redirect("/posts"); 
 })

 //Get to the Specific Post 
 app.get("/posts/:id",(req,res)=>{
   let {id} = req.params;
   let post = posts.find((p)=>p.id === id ) ;
   res.render("show.ejs" , {post});
 })

 //Edit server data partially using patch request 

app.get('/posts/:id/edit',(req,res)=>{
   let {id} = req.params;
   let post = posts.find((p)=>p.id === id);
   res.render("edit.ejs",{post});
})

 app.patch('/posts/:id',(req,res)=>{
   let {id} = req.params;
   let newcontent = req.body.content ;
   let post = posts.find((p)=>p.id === id) ;
   post.content = newcontent ;
   res.redirect("/posts");
 })   
///

/// Delet  a Post 
app.delete('/posts/:id',(req,res)=>{
   let {id} = req.params;
   let post = posts.find((p)=>p.id === id) ;
   let index = posts.findIndex((p)=>p.id===id);
   posts.splice(index,1);
   res.redirect("/posts");
})

app.listen(port, ()=>{
    console.log(`App is Listening on the port ${port} `); 
})