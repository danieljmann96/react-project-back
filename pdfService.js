let Queries = require('./queryMethods');

class pdfService {
    constructor(db) {
        this.queries = new Queries(db);
    }

    async find(req, res) {
        let result;
        try {
            result = await this.queries.handleFind(req);
        } catch (e) {
            result = e.message;
        }
        result.toArray((err, docs) => res.send(docs));
    }

    async create(req, res) {
        let result;

        try {
            result = await this.queries.handleCreate(req);
        } catch (e) {
            result = e.message;
        }
        res.send(result);
    }

    async read(req, res) {
        let result;
        try {
            result = await this.queries.handleRead(req);
        } catch (e) {
            result = e.message;
        }
        res.send(result);
    }

    async update(req, res) {
        let result;

        try {
            result = await this.queries.handleUpdate(req);
        } catch (e) {
            result = e.message;
        }
        res.send(result);
    }

    async delete(req, res) {
        let result;
        try {
            result = await this.queries.handleDelete(req);
        } catch (e) {
            result = e.message;
        }
        res.send(result);
    }
}

module.exports = pdfService;