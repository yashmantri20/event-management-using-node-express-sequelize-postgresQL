const Event = require('../models').Event;
const User = require('../models').User;

const { validEventCreated, validInviteInput } = require('../../utils/EventValidation');

module.exports = {
    async createevent(req, res) {
        const { eventName, description, date } = req.body;
        const err = validEventCreated(eventName, description, date);

        if (err) return res.json({
            message: err
        })

        try {
            const userId = req.decoded;
            const findUser = await User.findByPk(userId.id);
            console.log(findUser)
            const event = await Event.create({ eventName, description, date, createdBy: findUser.dataValues.username });
            findUser.dataValues.eventsCreated.push(event);
            await findUser.save();
            res.json({
                message: "Event Created"
            })

        } catch (error) {
            res.json({
                message: "Please Try Again"
            })
        }
    }
};