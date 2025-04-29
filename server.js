// server.js
const { createServer: createHttpsServer } = require('https');
const { createServer: createHttpServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const express = require('express');
var cors = require('cors');  // Add this line


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// const httpPort = 3001;
// const httpsPort = 3000;
const httpPort = 3000;
const httpsPort = 443;

const sslOptions = {
    key: fs.readFileSync('https-requirements/localhost.key'),
    cert: fs.readFileSync('https-requirements/localhost.crt'),
    ca: fs.readFileSync('https-requirements/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

app.prepare().then(() => {
    const expressApp = express();

    expressApp.use(express.static(__dirname + "/public"));

    expressApp.use((req, res) => {
        return handle(req, res);
    });

    const httpServer = createHttpServer(expressApp);

    const httpsServer = createHttpsServer(sslOptions, expressApp);

    httpServer.listen(httpPort, (err) => {
        if (err) throw err;
        console.log(`> HTTP Server running on http://localhost:${httpPort}`);
    });

    httpsServer.listen(httpsPort, (err) => {
        if (err) throw err;
        console.log(`> HTTPS Server running on https://localhost:${httpsPort}`);
    });
});