let express = require('express');
let mongodb = require('mongodb');
let bb = require('express-busboy');
let pdfService = require('./pdfService');
let cors = require('cors');


let app = express();

bb.extend(app, {
    upload: true,
    path: '/path/to/save/files',
    allowedPath: /./
});

app.use(cors({origin:true,credentials: true}));


app.listen(8000);

let db;
let query;

mongodb.MongoClient.connect('mongodb://localhost', { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    db = client.db('gitpdf');
    pdfResults = new pdfService(db);
});

app.get('/find/:prop/:props', (req, res) => pdfResults.find(req, res));
app.post('/create', (req, res) => pdfResults.create(req, res));
app.get('/read/:id', (req, res) => pdfResults.read(req, res));
app.put('/update/:id', (req, res) => pdfResults.update(req, res));
app.delete('/delete/:id', (req, res) => pdfResults.delete(req, res));