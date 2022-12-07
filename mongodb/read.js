const dbConnect = require("./database");

// dbConnect().then((resp) => {
//   resp
//     .find({Brand: 'Apple'})
//     .toArray()
//     .then((data) => {
//       console.log(data);
//     });
// });

const main = async () =>{
    let data = await dbConnect();
    data = await data.find({Brand: 'Xiaomi'}).toArray();
    console.log(data);
}

main();