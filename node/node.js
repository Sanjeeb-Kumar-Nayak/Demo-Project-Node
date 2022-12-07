const http = require("http");
const data = require('./data');
// const fs = require("fs");
// const data = require('./data');
// console.log(data.x);
// fs.writeFileSync("new.txt", "Namaste JavaScript")
// console.log(__filename)

http.createServer((req,resp) => {
    resp.writeHead(200,{'Content-Type':'application\json'});
    resp.write(JSON.stringify(data))
    resp.end();
}).listen(4500);