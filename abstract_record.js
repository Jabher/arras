import {Record as BaseRecord, Connection} from 'agregate'
import config from 'config'

export {Relation, acceptsTransaction} from 'agregate'

export class Record extends BaseRecord {
    static connection = new Connection(config.db.path)
}