const express = require('express');
const path = require('path');

const app = express();

app.set('view engine','ejs');

app.get('/profile',(req,resp)=>{
    const user = {
        name: "Milu",
        email: "milu@gmail.com",
        skills: ['JS','React','Node']
    };
   resp.render('profile',{user});
})

app.get('/login',(req,resp)=>{
    resp.render('login');
})

app.listen(5500);
