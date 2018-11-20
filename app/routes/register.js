module.exports = app => {
    const api = app.api.register;
  
    app.route(app.get('register'))
      .post(api.create);
  }