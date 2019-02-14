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
                        model: models.Role,
                        required: false,
                        attributes: {
                            exclude: ['roleType_id', 'user_id', 'course_id']
                        },
                        include: [
                            {
                                model: models.RoleType,
                                required: false
                            },
                            {
                                model: models.Course,
                                required: false
                            }
                        ]
                    }]
                })
                .then(user => {
                    req.user = user;
                    next();
                }, e => {
                    res.status(500).json(error.parse('auth-03', e));
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
        if(req.user.Roles.some(o => o.RoleType.name == 'Administrador')) next();
        else res.status(401).json(error.parse('auth-08', new Error("Administrator level required")));
    }

    api.checkAccessLevel = (req, res, next) => {
        function callBack(finded){
            if(finded) next();
            else res.status(401).json(error.parse('auth-10', new Error("You don't have permission to require this operation")));
        }

        let processed = 0;
        let finded = false;
        if(req.user.Roles.length === 0) callBack(false);
        else if(req.user.Roles.some(o => o.RoleType.name == 'Administrador')) next();
        else req.user.Roles.forEach((role, i, arr) => {
               models.RolePermission.findAll({
                where: {
                    roleType_id: role.RoleType.id
                },
                include: [
                    {
                        model: models.Permission,
                        required: false,
                        include: [
                            {
                                model: models.Action,
                                required: false,
                                attributes: ['name']
                            },
                            {
                                model: models.Target,
                                required: false,
                                attributes: ['name', 'urn']
                            }
                        ],
                        attributes: ['action_id', 'target_id']
                    }
                ],
                attributes: ['permission_id']
                }).then(rolePermissions => {
                    processed++;
                    console.log(req.route.path);
                    if(rolePermissions.some(rp => rp.Permission.Action.name == req.method && (rp.Permission.Target.urn == req.originalUrl || rp.Permission.Target.urn == req.route.path)) ) {
                        finded = true;
                    }
                    if(processed === arr.length)
                        if(finded) callBack(true);
                        else callBack(false);
                    else if(finded) callBack(true);
                });
        });
    }

    api.checkCourseStaff = (req, res, next) => {
        if(req.user.Roles.length === 0) res.status(401).json(error.parse('auth-10', new Error("You're not member of this course staff.")));
        else if(req.user.Roles.some(o => (o.RoleType.name == 'Administrador' || o.Course.id == req.body.course_id))) next();
        else res.status(401).json(error.parse('auth-11', new Error("You're not member of this course staff.")));
    }

    return api;
}
