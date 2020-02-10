import 'jest';

import * as request from 'supertest';

const address: string = (<any>global).address;
const auth: string = (<any>global).auth;

test('get /users', () => {
    return request(address)
        .get('/users')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        })
        .catch(fail);
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'User One',
            gender: 'Male',
            email: 'user-one@email.com',
            password: 'qwerty',
            cpf: '962.116.531-82'
        })
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('User One');
            expect(response.body.gender).toBe('Male');
            expect(response.body.email).toBe('user-one@email.com');
            expect(response.body.cpf).toBe('962.116.531-82');
            expect(response.body.password).toBeUndefined();
        })
        .catch(fail);
})

test('get /users/aaaaa - not found', () => {
    return request(address)
        .get('/users/aaaaa')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404);
        })
        .catch(fail);
})

test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'User Two',
            email: 'user-two@email.com',
            password: 'qwerty'
        })
        .then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .set('Authorization', auth)
            .send({name: 'User Two Patch'})
        )
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('User Two Patch');
            expect(response.body.email).toBe('user-two@email.com');
            expect(response.body.password).toBeUndefined();
        })
        .catch(fail);
})
