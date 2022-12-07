const express = require('express');
require('../mongoose/collection');
const productModel = require('../mongoose/schema');

const app = express();
app.use(express.json());

app.get('/search',async (req,resp)=>{
    let data = await productModel.find(
        {
            $or:[
                {name:"Sanjeeb Kumar Nayak"}
            ]
        }
    );
    resp.send(data);
})

app.post('/search',async (req,resp)=>{
    let data = await productModel.find(
        {
            $or:[
                {name:req.body.name}
            ]
        }
    );
    resp.send(data);
})

app.listen(5000);