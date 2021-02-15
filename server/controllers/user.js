const User = require('../models').User;
const Event = require('../models').Event;
const { Op } = require("sequelize");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validRegiterInput, validLoginInput, validChangePasswordInput, validResetPasswordInput } = require('../../utils/UserValidation');
const { mailSender } = require('../../utils/mailSender');
const crypto = require('crypto');

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.SECRET_KEY
    );
}

module.exports = {
    async create(req, res) {
        const { username, password, email } = req.body;

        const err = validRegiterInput(username, email, password);
        if (err) return res.json({
            message: err
        })

        try {
            const user = await User.create({
                username,
                email,
                password: await bcrypt.hash(password, 12),
            })
            const token = generateToken(user)
            return res.json({
                message: "User Created",
                data: { username: user.username, email: user.email, token }
            })
        } catch (error) {
            res.json({
                message: error
            })
        }

    },

    async login(req, res) {
        const { email, password } = req.body;
        const err = validLoginInput(email, password);

        if (err) return res.json({
            message: err
        })
        try {

            const findUser = await User.findOne({
                where:
                    { email }
            });

            if (findUser) {
                const user = await bcrypt.compareSync(password, findUser.dataValues.password);
                if (!user) {
                    return res.json({ message: "Please Enter Valid Email or Password" })
                }
                const token = generateToken(findUser);
                return res.json({ message: "User Login successfull", data: { findUser, token } })
            }
            return res.json({ message: "User does not exist" })
        } catch (error) {
            console.log(error)
            return res.json({ message: "Please Try Again" })
        }
    },

    async updatepassword(req, res) {
        let { oldPassword, newPassword } = req.body;

        const err = validChangePasswordInput(oldPassword, newPassword);
        if (err) return res.json({
            message: err
        })

        try {
            const userId = req.decoded;
            if (userId) {
                const findUser = await User.findByPk(userId.id);
                const match = bcrypt.compareSync(oldPassword, findUser.dataValues.password);
                if (!match) return res.json({
                    message: "Please Enter Correct password"
                })

                const user = await findUser.update(
                    {
                        password: await bcrypt.hash(newPassword, 12)
                    })

                if (user) return res.json({
                    message: "Password Updated Successfully"
                })
            }
        } catch (error) {
            res.json("Authentication Error")
        }
    },

    async resetpassword(req, res) {
        let { email } = req.body;
        const err = validResetPasswordInput(email);

        if (err) return res.json({
            message: err
        })
        try {
            const findUser = await User.findOne({
                where:
                    { email }
            });
            if (findUser) {
                const token = crypto.randomBytes(20).toString('hex');
                await findUser.update({
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 60000,
                })
                await mailSender(email, findUser.dataValues.username, token);
                return res.json({
                    message: "Recovery Mail Sent"
                })
            }
            return res.json({
                message: "User Does not Exist"
            })
        } catch (error) {
            res.json({
                message: "Please Try Again"
            })
        }
    },

    async changepassword(req, res) {
        const { token } = req.params;
        const { newPassword } = req.body;
        const err = validChangePasswordInput(newPassword);

        if (err) return res.json({
            message: err
        })
        try {
            const user = await User.findOne(
                {
                    where:
                    {
                        resetPasswordToken: token,
                        resetPasswordExpires: {
                            [Op.gt]: String(Date.now())
                        }
                    }
                })
            if (user) {
                await user.update({
                    password: await bcrypt.hash(newPassword, 12)
                })
                return res.json({
                    message: "Password Reset Successfully !"
                })
            }
            return res.json({
                message: "Link has been expired !"
            })
        } catch (error) {
            console.log(error)
            res.json({
                message: "Please Try Again"
            })
        }
    }
};