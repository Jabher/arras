const Todo = require('./models/todo');

module.exports.create = (props) => new Todo(props).save().then(body => ({status: 201, body}));
module.exports.read = ({id}) => Todo.byId(id);
module.exports.update = ({id, ...props}) => Todo.byId(id).then(todo => Object.assign(todo, props).save());
module.exports.search = () => Todo.where();
module.exports.destroy = ({id}) => Todo.byId(id).then(todo => todo.destroy()).then(() => undefined);
module.exports.destroyAll = () => Todo.destroyAllCompleted().then(() => undefined);