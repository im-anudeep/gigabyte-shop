const fs = require("fs");
const http = require("http");
const url = require("url");

const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const query = url.parse(req.url, true).query;

  // PRODUCTS OVERVIEW LIST PAGE (Also homepage)
  if (pathName === "/products" || pathName === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      "utf-8",
      (err, data) => {
        let overviewOutput = data;

        fs.readFile(
          `${__dirname}/templates/template-laptop-card.html`,
          "utf-8",
          (err, data) => {
            const cardsOutput = laptopData
              .map((el) => replaceTemplate(data, el))
              .join("");
            overviewOutput = overviewOutput.replace("{%CARDS%}", cardsOutput);

            res.end(overviewOutput);
          }
        );
      }
    );
  }

  // LAPTOP DETAIL PAGE
  else if (
    pathName === "/laptop" &&
    query.id < laptopData.length &&
    query.id > -1
  ) {
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      "utf-8",
      (err, data) => {
        const laptopObj = laptopData[query.id];
        const output = replaceTemplate(data, laptopObj);
        res.end(output);
      }
    );
  }

  // IMAGES
  else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { "Content-type": "image/jpg" });
      res.end(data);
    });
  }

  // URL NOT FOUND (rest all paths)
  else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("Url was not found on the server");
  }
});

server.listen(1337, "127.0.0.1", () => {
  console.log("listening for requests now");
});

function replaceTemplate(originalHtml, laptopObj) {
  let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptopObj.productName);
  output = output.replace(/{%PRICE%}/g, laptopObj.price);
  output = output.replace(/{%IMAGE%}/g, laptopObj.image);
  output = output.replace(/{%SCREEN%}/g, laptopObj.screen);
  output = output.replace(/{%CPU%}/g, laptopObj.cpu);
  output = output.replace(/{%STORAGE%}/g, laptopObj.storage);
  output = output.replace(/{%RAM%}/g, laptopObj.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptopObj.description);
  output = output.replace(/{%ID%}/g, laptopObj.id);
  return output;
}
