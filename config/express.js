const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const consign = require('consign');
const secrets = require('./secrets.json');
const apiRoutes = require('./apiRoutes.json');

app.use(bodyParser.json());
//Load Secrets File.
secrets.forEach(s => {
    app.set(s.key, s.value);
});
//Load API Routes file
apiRoutes.forEach(r => {
    app.set(r.key, r.value);
});

app.set('port', process.env.PORT || 3000);



consign({cwd: 'app'})
    .include('helpers')
    .then('errors')
    .then('models/index.js')
    .then('api')
    .then('routes')
    .then('swagger')
    .into(app);

module.exports = app;
