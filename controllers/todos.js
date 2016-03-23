import Todo from './models/todo'

export const create = (props) => new Todo(props).save().then(body => ({status: 201, body}));
export const read = ({id}) => Todo.byId(id);
export const update = ({id, ...props}) => Todo.byId(id).then(todo => Object.assign(todo, props).save());
export const search = () => Todo.where();
export const destroy = ({id}) => Todo.byId(id).then(todo => todo.destroy()).then(() => undefined);
export const destroyAll = () => Todo.destroyAllCompleted().then(() => undefined);