export default function (store = {target: 'world'}, action = {}) {
    switch (action.type) {
        case 'HELLO_TARGET_CHANGE':
            return {target: action.target};
        default:
            return store
    }
}