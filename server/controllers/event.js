const Event = require('../models').Event;
const User = require('../models').User;
const Guest = require('../models').Guest;

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
            const event = await findUser.createEvent({ eventName, description, date, createdBy: findUser.dataValues.username, userId: userId.id })
            return res.json({
                message: "Event Created",
                data: event
            });

        } catch (error) {
            res.json({
                message: "Please Try Again"
            })
        }
    },

    async showcreatedevents(req, res) {
        try {
            const user = req.decoded;
            const findUser = await User.findByPk(user.id);

            const userEvents = await findUser.getEvents();
            return res.json({
                message: "All Events",
                events: userEvents
            })
        } catch (error) {

            console.log(error)
            res.json({
                message: "Please Try Again"
            })
        }
    },

    async inviteUser(req, res) {
        const { email } = req.body;
        const err = validInviteInput(email);
        if (err) return res.json({
            message: err
        })

        try {
            const event = await Event.findByPk(req.params.eventId);
            const user = await User.findOne({
                where:
                {
                    email
                }
            }
            );

            if (!event) return res.json({
                message: "Please Enter Valid Event Id"
            })

            if (!user) return res.json({
                message: "Please Enter Email who is on Event Management"
            })

            const userAlreadyInvited = await Guest.findOne({
                where: {
                    eventId: req.params.eventId,
                    userId: user.id,
                }
            })

            if (userAlreadyInvited) return res.json({
                message: "User Already Invited"
            })

            const guest = await Guest.create({
                userId: user.id,
                eventId: req.params.eventId,
                eventName: event.eventName,
                createdBy: event.createdBy
            })

            return res.json({
                message: "Invited Successfully",
                data: guest
            })
        } catch (error) {
            console.log(error)
            res.json({
                message: "Please Try Again"
            })
        }
    },

    async showinvitedevents(req, res) {
        try {
            const user = req.decoded;
            const findUser = await User.findByPk(user.id);
            const userEvents = await findUser.getUsers();

            return res.json({
                message: "All Events",
                events: userEvents
            })
        } catch (error) {
            res.json({
                message: "Please Try Again"
            })
        }
    },

    async updateevent(req, res) {
        const { eventName, description, date } = req.body;
        const err = validEventCreated(eventName, description, date);

        if (err) return res.json({
            message: err
        })

        try {
            const { id } = req.decoded;

            const event = await Event.findByPk(req.params.eventId);
            if (event.userId !== id) return res.json({
                message: "Not Allowed to update"
            })

            await event.update({ eventName, description, date });
            res.json({
                message: "Event Updated",
                data: event
            })

        } catch (error) {
            res.json({
                message: "Please Try Again"
            })
        }
    },

    async showspecificevent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await Event.findByPk(eventId);

            const invitedList = await Guest.findAll({
                where: {
                    eventId
                },
                include: [{ model: User, as: "users", attributes: ["username", "email"] }],
                attributes: ['userId']
            });

            return res.json({
                message: "Specific Event",
                eventName: event.eventName,
                createdBy: event.createdBy,
                guests: invitedList
            })
        } catch (error) {
            console.log(error)
            res.json({
                message: "Please Try Again"
            })
        }
    },

    async deleteevent(req, res) {
        try {
            const { eventId } = req.params;
            const { id } = req.decoded;

            const event = await Event.findByPk(eventId)
            if (!event) return res.json({
                message: "Event Does not exist"
            })

            if (event.userId === id) {
                const deletedEvent = await Event.destroy({
                    where: {
                        id: eventId
                    }
                })

                return res.json({
                    message: "Event Deleted",
                    event: deletedEvent
                })
            }
            return res.json({
                message: "Your not allowed to delete the event",
            })

        } catch (error) {
            console.log(error)
            res.json({
                message: "Please Try Again"
            })
        }
    }
    // async filterByDate(req, res) {
    //     const date = req.query.date;
    //     try {
    //         const event = await Event.findAll({
    //             where: { date: date }
    //         })
    //         return res.json({
    //             message: "Events on " + date,
    //             events: event,
    //         });
    //     }
    //     catch (error) {
    //         res.json({
    //             message: "Please Try Again",
    //             error: error,
    //         });
    //     }
    // },

    // async pagination(req, res) {
    //     try {
    //         const page = parseInt(req.query.page);
    //         const limit = parseInt(req.query.limit);

    //         let s = ['eventName', 'ASC']
    //         if (req.query.sort) {
    //             const sort = req.query.sort;
    //             s = sort.split(":");
    //         }

    //         const offset = page ? page * limit : 0;

    //         const event = await Event.findAndCountAll({
    //             limit: limit,
    //             offset: offset,
    //             order: [
    //                 [s[0], s[1]]
    //             ]
    //         })
    //         const totalPages = Math.ceil(event.count / limit);
    //         res.json({
    //             data: {
    //                 "totalItems": event.count,
    //                 "totalPages": totalPages,
    //                 "limit": limit,
    //                 "currentPageNumber": page + 1,
    //                 "currentPageSize": event.rows.length,
    //                 "events": event.rows
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             error: error,
    //         });
    //     }
    // },

    // async searchfilter(req, res) {
    //     const eventname = req.query.event;
    //     try {
    //         const event = await Event.findAll({
    //             where:
    //             {
    //                 eventName: {
    //                     [Op.iLike]: eventname + "%"
    //                 }
    //             }
    //         })
    //         return res.json({
    //             message: "Events on " + eventname,
    //             events: event,
    //         });
    //     }
    //     catch (error) {
    //         res.json({
    //             message: "Please Try Again",
    //             error: error,
    //         });
    //     }
    // },

};