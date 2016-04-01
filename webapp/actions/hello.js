export function changeTarget(target) {
    return {
        type: 'HELLO_TARGET_CHANGE',
        target
    }
}
export const loadTargetAsync = () => async function (dispatch) {
    dispatch(await fetch('/hello'))  
};