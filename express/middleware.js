const express = require('express');
const reqFilter = require('./home');
const app = express();
const route = express.Router();

// const reqFilter = (req,resp,next)=> {
// //    console.log('Middleware called!!!');
//    if(!req.query.age){
//      resp.send("Please provide age");
//    }
//    else if(req.query.age<18){
//     resp.send("You can not access this page");
//    }
//    else{
//     next();
//    }
// };

// app.use(reqFilter);

route.use(reqFilter);

app.get('/',(req,resp)=>{
   resp.send('wel come to home page')
});

route.get('/user',(req,resp)=>{
    resp.send('wel come to user page')
 });

 route.get('/contact',(req,resp)=>{
    resp.send('wel come to contact page')
 });

 app.use('/',route);

app.listen(4200);