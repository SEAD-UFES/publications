const app = require('../config/express');
const request = require('supertest')(app);
const {users, populateUsers} = require('../seeders/users.seed');

beforeEach(populateUsers);

describe('GET /v1/me', () => {
    it('#Get user list - 200 status code', (done) => {
        request
            .post('/v1/auth')
            .send(users[0])
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                request
                    .get('/v1/me')
                    .set({'x-access-token': res.body.access_token})
                    .expect(200, done);
            });
    });
});