export const search = params => `hello, ${params.name || 'stranger'}`;
export const update = params => {
    if (params.id === 0)
        throw new Error('error happened!');
    
    if (params.id === '')
    
    return params
};