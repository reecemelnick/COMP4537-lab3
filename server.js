const http = require('http');
const url = require('url');
const dt = require('./modules/utils');
const fs = require('fs');
const userMessages = require('./lang/en/en.js');

class Server {
    constructor(port) {
        this.port = port;
        this.startServer();
    }

    handleGetDate(qdata, response) {
        let message = userMessages.greeting.replace("%1", qdata.name || "Stranger");
        
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write("<p style=\"color:blue;\">" + message + dt.getDate() + "</p>");
                response.end();
    }

    handleWriteFile(qdata, response) {
        let text = qdata.text ? qdata.text + "\n" : ""; 
        
        fs.appendFile("./file.txt", text, function(err) {
            if(err) {
                response.writeHead(500, {'Content-Type':'text/plain'});
                response.end(userMessages.fileError);
                return;
            }
            response.writeHead(200, {'Content-Type':'text/plain'});
            response.end(userMessages.fileSuccess);
        }); 
    }

    handleReadFile(q, response) {
        let filename = q.pathname.slice(10, q.pathname.length);
        fs.readFile(filename, (err, data) => {
            if (!err && data) {
                response.writeHead(200, {'Content-Type':'text/plain'});
                response.end(data);
            } else {
                response.writeHead(404, {'Content-Type':'text/plain'});
                response.end(userMessages.fileNotFound + " " + filename);
            }
          });
    }

    startServer() {
        http.createServer((request, response) => {

            let q = url.parse(request.url, true);
            let qdata = q.query;
        
            if (q.pathname === "/getDate/" || q.pathname === "/getDate") {
                this.handleGetDate(qdata, response);
            } else if (q.pathname === "/writeFile/" || q.pathname === "/writeFile") {
                this.handleWriteFile(qdata, response);
            } else if (q.pathname.startsWith("/readFile/") || q.pathname.startsWith("/readFile")) {
                this.handleReadFile(q, response);
            } else {
                response.writeHead(404, {'Content-Type':'text/plain'});
                response.end(userMessages.pageNotFound);
            }
        }).listen(this.port);
    }
}

let server = new Server(8000);

console.log("Listening...");
