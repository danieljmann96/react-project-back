let mongodb = require('mongodb');
let fs = require('fs');

class Queries {
    constructor(db) {
        this.db = db;
    }

    handleFind(req) {
        let regex = new RegExp(req.params.props, "i");
        return new Promise((resolve, reject) => {
            try {
                let query = {}
                query[req.params.prop] = { $regex: regex };
                resolve(this.db.collection('fs.files').find(query).sort({ uploadDate: -1 }));
            } catch (e) {
                console.log(e);
                reject(new Error("Something went wrong"));
            }
        });
    }

    handleCreate(req) {
        let bucket = new mongodb.GridFSBucket(this.db);
        return new Promise((resolve, reject) => {
            try {
                resolve(fs.createReadStream(req.files.load.file).pipe(bucket.openUploadStream(req.body.filename)).id);
            } catch (e) {
                console.log(e);
                reject(new Error("Something went wrong"));
            }
        });
    }

    handleRead(req) {
        let bucket = new mongodb.GridFSBucket(this.db);
        let o_id = new mongodb.ObjectID(req.params.id);
        let pdf = "";

        return new Promise((resolve, reject) => {
            try {
                let pdfStream = bucket.openDownloadStream(o_id);

                pdfStream
                    .on('data', (chunk) => pdf += chunk.toString('base64'))
                    .on('error', (err) => {
                        console.log(err);
                        reject(new Error("Something went wrong"))
                    });

                pdfStream
                    .on('end', () => resolve(pdf))
                    .on('error', (err) => {
                        console.log(err);
                        reject(new Error("Something went wrong"));
                    });
            } catch (e) {
                console.log(e);
                reject(new Error("Something went wrong"));
            }
        });
    }

    handleUpdate(req) {
        let o_id = new mongodb.ObjectID(req.params.id);
        return new Promise((resolve, reject) => {
            try {
                resolve(this.db.collection('fs.files').updateOne({ _id: o_id }, { $set: { meta: JSON.parse(req.body.meta) } }));
            } catch (e) {
                console.log(e);
                reject(new Error("Something went wrong"));
            }
        });
    }

    handleDelete(req) {
        let o_id = new mongodb.ObjectId(req.params.id);

        return new Promise((resolve, reject) => {
            try {
                this.db.collection('fs.files').deleteOne({ _id: o_id }, (errOne, resOne) => {
                    if (errOne) reject(errOne);
                    this.db.collection('fs.chunks').deleteMany({ files_id: o_id }, (errMany, resMany) => {
                        if (errMany) reject(errMany);
                        resolve(resMany);
                    });
                });
            } catch (e) {
                console.log(e);
                reject(new Error("Something went wrong"));
            }
        });
    }
}

module.exports = Queries;