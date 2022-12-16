const express = require('express');
require('../mongoose/collection');
const productModel = require('../mongoose/schema');

const app = express();
app.use(express.json());

app.post('/create',async (req,resp)=>{
    let data = new productModel(req.body);
    let result = await data.save();
    console.log(result);
    resp.send(result);
});

app.get('/list',async (req,resp)=>{
    let data = await productModel.find();
    let response = {"status":1, "message": "Sucess", "data":data}
    resp.send(response);
});

app.delete('/delete',async (req,resp)=>{
    let data = await productModel.deleteOne({name:"Rajiv"});
    resp.send(data);
});

app.put('/update/:name',async (req,resp)=>{
    let data = await productModel.updateOne(
        // {name:"Milu"},
        req.params,
        {
            $set:req.body
        }
    );
    resp.send(data);
});

app.listen(5000);