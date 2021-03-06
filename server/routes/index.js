const userController = require('../controllers').users;
const eventController = require('../controllers').events;
const Event = require('../models').Event;

const { validateToken } = require('../../utils/auth');
const { dateFilter, pagination, searchFilter } = require('../../utils/functionalities');

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Event Management API!',
    }));

    app.post('/user/register', userController.create);
    app.post('/user/login', userController.login);
    app.put('/user/updatepassword', validateToken, userController.updatepassword);
    app.post('/user/resetpassword', userController.resetpassword);
    app.put('/user/change/:token', userController.changepassword);
    app.post('/event/createEvent', validateToken, eventController.createevent);
    app.get('/event/createdEvents', validateToken, pagination(Event), eventController.showcreatedevents);
    app.put('/:eventId/invite', validateToken, eventController.inviteUser);
    app.get('/event/invitedEvents', validateToken, eventController.showinvitedevents);
    app.put('/:eventId/updateEvent', validateToken, eventController.updateevent);
    // app.get('/event/filterbydate', eventController.filterByDate);
    // app.get('/event/pagination', eventController.pagination);
    // app.get('/event/searchfilter', eventController.searchfilter);
    app.get('/event/:eventId', eventController.showspecificevent);
    app.delete('/event/:eventId', validateToken, eventController.deleteevent);

};