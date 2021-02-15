const { Op } = require("sequelize");

module.exports.dateFilter = (model) => {
    return async (req, res, next) => {
        const date = req.query.date;
        try {
            const event = await model.findAll({
                where: { date: date }
            })
            return res.json({
                message: "Events on " + date,
                events: event,
            });
        }
        catch (error) {
            res.json({
                message: "Please Try Again",
                error: error,
            });
        }
    };
};

module.exports.pagination = (model) => {
    return async (req, res, next) => {
        try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);

            let s = ['eventName', 'ASC']
            if (req.query.sort) {
                const sort = req.query.sort;
                s = sort.split(":");
            }

            const offset = page ? page * limit : 0;

            const event = await model.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [
                    [s[0], s[1]]
                ]
            })
            const totalPages = Math.ceil(event.count / limit);
            res.json({
                data: {
                    "totalItems": event.count,
                    "totalPages": totalPages,
                    "limit": limit,
                    "currentPageNumber": page + 1,
                    "currentPageSize": event.rows.length,
                    "events": event.rows
                }
            })
        } catch (error) {
            console.log(error)
            res.json({
                error: error,
            });
        }
    };
};

module.exports.searchFilter = (model) => {
    return async (req, res, next) => {
        const eventname = req.query.event;
        try {
            const event = await model.findAll({
                where:
                {
                    eventName: {
                        [Op.iLike]: eventname + "%"
                    }
                }
            })
            return res.json({
                message: "Events on " + eventname,
                events: event,
            });
        }
        catch (error) {
            console.log(error)

            res.json({
                message: "Please Try Again",
                error: error,
            });
        }
    };
};