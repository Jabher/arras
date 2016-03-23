import {Record, acceptsTransaction} from './_abstract_record';

const todoIncrement = 1;

export default class Todo extends Record {
    static indexes = new Set(['id']);

    @acceptsTransaction({force: true})
    static async destroyAllCompleted() {
        for (const todo of await this.where({completed: true})) 
            await todo.destroy(this.connection);
    }
    
    static byId(id) { return this.where({id}).then(todos => todos[0]) }
    
    async beforeCreate() {
        this.completed = false;
        
        const topIdTodo = await Todo.where({}, {order_by: 'id DESC', limit: 1}, this.connection).then(t => t[0]);
        this.id = topIdTodo ? topIdTodo.id + todoIncrement : todoIncrement;
    }
}

Todo.register();