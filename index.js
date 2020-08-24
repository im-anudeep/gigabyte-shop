const fs = require("fs");
const http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const query = url.parse(req.url, true).query;

  if (pathName === "/products" || pathName === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end("This is the PRODUCTS page");
  } else if (
    pathName === "/laptop" &&
    query.id < laptopData.length &&
    query.id > 0
  ) {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(`This is the LAPTOP page for Product ${query.id}`);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("Url was not found on the server");
  }
});

server.listen(1337, "127.0.0.1", () => {
  console.log("listening for requests now");
});
