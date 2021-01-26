const path = require("path");
const express = require("express");
const app = express();
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
const crypto = require("crypto");

let staticPath = path.join(__dirname, "public/");
app.use(express.json())
app.use(express.static(staticPath));

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

app.post('/fetchPdf', asyncMiddleware(async (req, res, next) => {
    const pdfPath = await downloadFile(req.body.url);
    if (pdfPath) {
        res.type('application/pdf');
        res.sendFile(pdfPath);
        res.on('finish', function () {
            try {
                fs.unlinkSync(pdfPath);
            } catch (e) {
                console.error(e);
                console.log(`Unable to delete file ${pdfPath}`);
            }
        });
    } else
        res.status(404).send('Not found');
}));

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        const absoluteFilePath = path.join(__dirname, `public/${crypto.randomBytes(20).toString('hex')}.pdf`);
        const file = fs.createWriteStream(absoluteFilePath);
        console.log(`Requested url ${url}`);
        const request = http.get(url, function (downloadResponse) {
            downloadResponse.pipe(file).on('finish', () => {
                resolve(absoluteFilePath);
            });
        }).on('error', function (err) {
            fs.unlink(absoluteFilePath);
            resolve(null);
        });
    });
}

// Allows you to set port in the project properties.
app.set("port", 8080);


let server = app.listen(app.get("port"), function () {
    console.log("listening");
});