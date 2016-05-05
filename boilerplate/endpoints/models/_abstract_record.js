const {Record: BaseRecord, Connection, Relation, acceptsTransaction} = require('agregate');
var {db} = require('config');

class Record extends BaseRecord {
    static connection = new Connection(db.path);
}

Object.assign(module.exports, {Record, Relation, acceptsTransaction});