module.exports = app => {

    const models = require('../models');
    const jwt = require('jsonwebtoken');
    const api = {};
    const error = app.errors.auth;

    api.authenticate = (req, res) => {
        if(Array.isArray(req.body) || (req.body.constructor === Object && Object.keys(req.body).length === 0) || !req.body.login || !req.body.password) res.status(400).json(error.parse('auth-03', new Error('This resource spect a JSON user object in the body request containing username and password.')));
        else{
            models.User.findOne({where: {login: req.body.login}})
                .then(user => {
                    if(!user){
                        res.status(401).json(error.parse('auth-04', new Error('This login was not found.')));
                    }else if(!user.authorized) res.status(401).json(error.parse('auth-09', new Error("User is unauthorized")));
                          else user.validPassword(req.body.password)
                                .then(valid => {
                                    if(valid){
                                        let access_token = jwt.sign({ data: user.id }, app.get('jwt_secret'), { expiresIn: "6h" });
                                        res.json({access_token, userMessage: 'Authentication success'});
                                    }else{
                                        res.status(401).json(error.parse('auth-05', new Error('Wrong password.')));
                                    }
                                });
                    
                }, e => res.status(500).json(error.parse('auth-06', new Error('Internal server error.'))));
        }
    };

    api.authenticationRequired = (req, res, next) => {
        try{
            decoded = jwt.verify(req.headers['x-access-token'], app.get('jwt_secret'));
            models.User.findById(
                decoded.data, 
                {
                    include: [{
                        model: models.RoleType,
                        as: 'roles',
                        required: false,
                        attributes: ['id', 'name'],
                        through: { attributes: [] }
                    }]
                })
                .then(user => {
                    req.user = user;
                    next();
                }, error => {
                    res.status(500).json(error.parse('auth-03', {}));
                });
        }catch(e){
            switch(e.name){
                case "TokenExpiredError": 
                    res.status(401).json(error.parse('auth-01', e));
                    break;
                case "JsonWebTokenError":
                    res.status(401).json(error.parse('auth-02', e));
                    break;
                default:
                    res.status(401).json(error.parse('auth-07', e));
            }
        }
    }

    api.adminRequired = (req, res, next) => {
        if(req.user.roles.some(o => o.name == 'Administrador')) next();
        else res.status(401).json(error.parse('auth-08', new Error("Administrator level required")));
    }

    return api;
}
