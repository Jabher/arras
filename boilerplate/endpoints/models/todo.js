const {Record, acceptsTransaction} = require('./_abstract_record');

const todoIncrement = 1;

export default class Todo extends Record {
    static indexes = new Set(['id']);

    static byId(id) { return this.where({id}).then(todos => todos[0]) }
}

Todo.byId = acceptsTransaction(Promise.coroutine(function*(id) {
    var [todo] = yield this.where({id}, this.connection);
    return todo;
}));

Todo.destroyAllCompleted = acceptsTransaction({force: true})(Promise.coroutine(function*() {
    for (const todo of yield this.where({completed: true}))
        yield todo.destroy(this.connection);
}));

Todo.prototype.beforeCreate = Promise.coroutine(function*() {
    this.completed = false;

    const [topIdTodo] = yield Todo.where({}, {order_by: 'id DESC', limit: 1}, this.connection);
    this.id = topIdTodo ? topIdTodo.id + todoIncrement : todoIncrement;
});

Todo.register();