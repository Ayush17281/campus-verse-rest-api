# campus-verse-rest-api

## Overview

A small college posting app I built while learning **Node.js, Express.js, EJS and REST APIs**.

Users can create posts with an anonymous username and share their college-related thoughts and experiences. **Initially, the app used an in-memory array to store data; database integration was added later as part of the learning process.**


## Tech Stack

- Node.js
- Express.js
- EJS
- REST APIs
- Bootstrap
- CSS
- JavaScript
- UUID

## How to Run
1. Clone the repository:
```bash
git clone https://github.com/Ayush17281/campus-verse-rest-api.git
```
2. Go to the project folder:
   ```bash
   cd campus-verse-rest-api
   ```
3. Install dependencies:
```bash
npm install
```
4. Start the server 
```bash
nodemon index.js

```

If nodemon is not installed: 
```bash
npm install -g nodemon

```
5. Open in browser:
```bash
http://localhost:8080/posts
```

## Features

* Create a post
* View all posts
* View post details
* Edit posts
* Delete posts
* Anonymous usernames
* Simple Bootstrap UI

## Routes

```text
GET     /posts          → View all posts
GET     /posts/new      → Create a new post
GET     /posts/:id      → View a specific post
GET     /posts/:id/edit → Edit a post
PATCH   /posts/:id      → Update a post
DELETE  /posts/:id      → Delete a post
```

## What I Learned

This project helped me practice:

* Express routing
* EJS templating
* REST APIs
* CRUD operations
* HTML forms
* Basic Bootstrap styling

> A small project as part of my MERN stack learning journey.
