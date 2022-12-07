const express = require('express');
const app = express();

app.get('',(req,res)=>{
  res.send(`<h1>welcome to root page</h1>
            <a href="/about">Go To About Page</a>`);
});

app.get('/home',(req,res)=>{
    console.log("data send by browser => ",req.query.name)
    res.send(`
      <input type="text" placeholder="Enter your name" value="${req.query.name}" />
      <button>Submit</button>
    `);
});

  app.get('/about',(req,res)=>{
    res.send([
        {
            name: "Tilu",
            email: "tilu@gmail.com" 
        },
        {
            name: "Milu",
            email: "milu@gmail.com" 
        }
    ]);
});

app.listen(4000);