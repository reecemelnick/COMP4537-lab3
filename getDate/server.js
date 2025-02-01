const http = require('http');
const url = require('url');
const dt = require('./modules/utils');
const userMessages = require('./lang/en/en.js');

http.createServer(function (request, response) {

    let q = url.parse(request.url, true);

    let qdata = q.query;

    let message = userMessages.greeting.replace("%1", qdata.name || "Stranger");

    response.writeHead(200, {'Content-Type':'text/html'});
    response.write("<p style=\"color:blue;\">" + message + dt.getDate() + "</p>");
    response.end();

}).listen(8000);

console.log("Listening...");
