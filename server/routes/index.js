const userController = require('../controllers').users;
const eventController = require('../controllers').events;

const { validateToken } = require('../../utils/auth');


module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Todos API!',
    }));

    app.post('/user/register', userController.create);
    app.post('/user/login', userController.login);
    app.put('/user/updatepassword', validateToken, userController.updatepassword);
    app.post('/user/resetpassword', userController.resetpassword);
    app.put('/user/change/:token', userController.changepassword);
    app.post('/event/createEvent', validateToken, eventController.createevent);

};