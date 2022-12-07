const dbConnect = require('./database');

const remove = async () => {
     const data = await dbConnect();
     const result = await data.deleteOne({Model: 'V20'});
     console.log(result);
}

remove()