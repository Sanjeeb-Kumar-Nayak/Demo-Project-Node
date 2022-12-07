const dbConnect = require('./database');

const update = async () => {
    const data = await dbConnect();
    const result = await data.updateOne(
           {Model: 'Y95'},
           {$set: {Model: 'V20', Price: 26999}}
    );
    console.log(result);
}

update();