const app = require('../config/express');
const request = require('supertest')(app);
const {users, populateUsers} = require('../seeders/users.seed');

//beforeEach(populateUsers);

describe('POST /v1/users', () => {
    it('#Post a new user - 201 status code', (done) => {
        request
            .post('/v1/users')
            .send({
                    login:'user-teste-01',
                    password: 'pass01'
            }).expect(201, done);           
    });
    it('#Post repeated login - 400 status code', (done) => {
        request
            .post('/v1/users')
            .send(users[0]).expect(400, done);
    });
    it('#Post empty body - 400 status code', (done) => {
        request
            .post('/v1/users')
            .send({}).expect(400, done);
    });
    it('#Post without login - 400 status code', (done) => {
        request
            .post('/v1/users')
            .send({
                password: '2222'
            }).expect(400, done);
    });
    it('#Post without password - 400 status code', (done) => {
        request
            .post('/v1/users')
            .send({
                login:'user-teste-01'
            }).expect(400, done);
    });
});

describe('Get user list /v1/users', () => {
    it('#Get user list - 200 status code', (done) => {
        request
            .post('/v1/auth')
            .send(users[0])
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                request
                    .get('/v1/users')
                    .set({'x-access-token': res.body.access_token})
                    .expect(200, done);
            });
    });
    it('#Get without access-token - 401 status code', (done) => {
        request
            .get('/v1/users')
            .expect(401, done);
    });
    it('#Get with wrong access-token - 401 status code', (done) => {
        request
            .get('/v1/users')
            .set({'X-Access-Token': 'fdsfsdfsdfsdf'})
            .expect(401, done);
    });
});

describe('PUT to /v1/users', () => {
    it('#Update a userdata - 200 status code', (done) => {
        let access_token = "";
        request
        .post('/v1/auth')
        .send(users[0])
        .expect(200)
        .end((err, res) => {
            access_token = res.body.access_token;
            if(err) return done(err);
            request
                .get('/v1/me')
                .set({'x-access-token': access_token})
                .expect(200)
                .end((err, res) => {
                    if(err) return done(err);
                    request
                        .put('/v1/users/'+res.body.user.id)
                        .set({'x-access-token': access_token})
                        .send({"login":"wagnerperin2"})
                        .expect(200)
                        .end((err, res) => {
                            if(err) return done(err);
                            if(res.body.login == "wagnerperin2") done();
                            else done(new Error("User not updated"));
                        })
                });
        });
    });
});

describe('DELETE /v1/users/:id', () => {
    it('#Unauthorized - 200 status code', (done) => {
        done();//IMPLEMENTAR
    });
});
