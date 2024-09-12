import { createServer } from "node:http";

const server = createServer((request, response) => {
  console.log(request.headers);
  console.log(request.method);
  console.log(request.url);
  response.writeHead(200, { "Content-Type": "text/html" });
  if (request.url === "/") {
    response.end("<h1>Hello world!</h1>");
  } else {
    response.end(`<h1>Requested URL: ${request.url}</h1>`);
  }
});

server.listen(8000);
