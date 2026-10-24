
//MIDDLEWARES
const bcrypt = require('bcrypt');
const session = require('express-session');

const cors = require('cors');
const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();
const    {v4 : uuidv4} = require("uuid") ;



// Settin up a local Server 
const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://campus-verse-frontend.vercel.app'
  ],
  credentials: true
}));
//Communication end point between client and Server 
const port = process.env.PORT || 8080  ;

//parse the data
app.use(express.urlencoded({extended:true})) ;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));


app.get('/api/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  res.json({
    user: {
      id: req.session.userId,
      username: req.session.username
    }
  });
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@vit\.edu$/i.test(email.trim())) {
    return res.status(400).json({ error: 'Use your @vit.edu email' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    connection.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username.trim(), email.trim().toLowerCase(), hashedPassword],
      (err, result) => {
        if (err?.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already registered' });
        }
        if (err) {
          return res.status(500).json({ error: 'Signup failed' });
        }

        req.session.userId = result.insertId;
        req.session.username = username.trim();

        res.status(201).json({
  message: 'Signup successful',
  user: { id: result.insertId, username: username.trim() }
});
      }
    );
  } catch {
    res.status(500).json({ error: 'Signup failed' });
  }
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email.trim().toLowerCase()],
    async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (!results.length) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      req.session.username = user.username;

     res.json({
  message: 'Login successful',
  user: { id: user.id, username: user.username }
});
    }
  );
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

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

connection.query("SELECT DATABASE()", (err, result) => {
  console.log("Backend database:", result);
});
connection.query("SHOW COLUMNS FROM posts", (err, result) => {
  console.log("Backend posts columns:", err || result);
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

// API: Get all posts as JSON
app.get("/api/posts", (req, res) => {
  const q = "SELECT * FROM posts ORDER BY created_at DESC";

  connection.query(q, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});





app.post('/api/posts', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please log in first' });
  }

  const { content, category } = req.body;
  const allowedCategories = ['General', 'Placements', 'Events', 'Clubs'];

  if (!content?.trim() || !allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid post content or category' });
  }

  const id = uuidv4();
 const q = `
  INSERT INTO posts (id, user_id, username, content, category)
  VALUES (?, ?, ?, ?, ?)
`;

 connection.query(
  q,
  [id, req.session.userId, req.session.username, content.trim(), category],
  (err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not create post' });
    }

    res.status(201).json({ message: 'Post created', id });
  }
);
});



const axios = require('axios');

app.get('/api/tech-news', async (req, res) => {
  try {
    const response = await axios.get(
      'https://hn.algolia.com/api/v1/search',
      {
        params: {
          query: req.query.q || 'artificial intelligence',
          tags: 'story',
          hitsPerPage: 10
        }
      }
    );

    res.json(response.data.hits);
  } catch (err) {
    console.error(err.message);
    res.status(502).json({ error: 'Could not load tech news' });
  }
});

app.put('/api/posts/:id', (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Please log in' });

  const { content, category } = req.body;
  const allowed = ['General', 'Placements', 'Events', 'Clubs'];

  if (!content?.trim() || !allowed.includes(category))
    return res.status(400).json({ error: 'Invalid content or category' });

  connection.query(
    'UPDATE posts SET content = ?, category = ? WHERE id = ? AND user_id = ?',
    [content.trim(), category, req.params.id, req.session.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Update failed' });
      if (!result.affectedRows)
        return res.status(404).json({ error: 'Post not found or not yours' });
      res.json({ message: 'Post updated' });
    }
  );
});

app.delete('/api/posts/:id', (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Please log in' });

  connection.query(
    'DELETE FROM posts WHERE id = ? AND user_id = ?',
    [req.params.id, req.session.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Delete failed' });
      if (!result.affectedRows)
        return res.status(404).json({ error: 'Post not found or not yours' });
      res.json({ message: 'Post deleted' });
    }
  );
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