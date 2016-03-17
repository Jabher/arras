import '../index.es6.js';
import fetch from 'node-fetch';
import {expect} from 'chai';
import config from 'config';

import HTTPCodes from '../http_codes';

const basepath = `http://${process.NODE_ENV || 'localhost'}:${config.server.port}/todos`;

describe('todoMVC API', () => {
    const baseBody = {title: 'todo'};
    const createTodo = async(body) => {
        const response = await fetch(`${basepath}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        });
        return await response.json();
    };

    describe('collection [/todos]', () => {
        it('Create a Todo [POST]', async() => {
            const response = await fetch(`${basepath}`, {
                method: 'POST',
                body: JSON.stringify(baseBody),
                headers: {'Content-Type': 'application/json'}
            });
            expect(response.status).to.equal(HTTPCodes.CREATED);
            const body = await response.json();
            expect(body).to.deep.include({...baseBody, completed: false});
            expect(body).to.have.property('id');
        });

        it('Archive completed Todos [DELETE]', async() => {
            const response = await fetch(`${basepath}`, {method: 'DELETE'});
            expect(response.status).to.equal(HTTPCodes.NO_CONTENT);
        });

        it('List all Todos [GET]', async() => {
            await fetch(`${basepath}`, {method: 'DELETE'});
            await createTodo(baseBody);
            const response = await fetch(`${basepath}`);
            expect(response.status).to.equal(HTTPCodes.OK);
            expect(await response.json())
                .and.to.have.property('0')
                .that.deep.include({...baseBody, completed: false})
        })
    });

    describe('todo [/todos/:id]', () => {
        let id;
        beforeEach(async() =>
            id = (await createTodo(baseBody)).id);

        it('Get a Todo [GET]', async() => {
            const response = await fetch(`${basepath}/${id}`);
            expect(response.status).to.equal(HTTPCodes.OK);
            expect(await response.json()).to.deep.include({...baseBody, completed: false})
        });

        it('Update a Todo [PUT]', async() => {
            const updatedBody = {title: 'test2', completed: true};
            const response = await fetch(`${basepath}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedBody),
                headers: {'Content-Type': 'application/json'}
            });
            expect(response.status).to.equal(HTTPCodes.OK);
            expect(await response.json()).to.deep.include({...baseBody, ...updatedBody})
        });

        it('Delete a Todo [DELETE]', async() => {
            const response = await fetch(`${basepath}/${id}`, {method: 'DELETE'});
            expect(response.status).to.equal(HTTPCodes.NO_CONTENT);
        });
    });
});