const dbConnect = require('./database');

const insert = async () => {
    const data = await dbConnect();
    const result = await data.insert({
        Model: 'Note 4' , Brand: 'Xiomi', Category: 'Mobile', Price: 12999
    });
    console.log(result);
}

insert();