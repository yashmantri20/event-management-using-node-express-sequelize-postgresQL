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
            const event = await Event.create({ eventName, description, date, createdBy: findUser.dataValues.username, userId: userId.id });
            const ok = await findUser.dataValues.eventsCreated.push(['reactjs'])
            // console.log(typeof findUser.eventsCreated)
            // array_append(findUser.dataValues.eventsCreated, "reactjs");
            // const ok = await findUser.save();
            // await findUser.update({
            //     eventsCreated: ok.dataValues.eventsCreated,
            // });
            console.log(ok)

            res.json({
                message: "Event Created"
            })
            // const d = await findUser.update({
            //     eventsCreated: ok
            // });
            // console.log(d)
            // return d;

        } catch (error) {
            console.log(error)
            res.json({
                message: "Please Try Again"
            })
        }
    }
};