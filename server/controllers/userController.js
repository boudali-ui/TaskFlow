const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res, next) {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        res.status(201).json({
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        next(error);
    }
};

async function login(req, res, next) {
    try {
        const user = await User.findOne({
            email: req.body.email,
        }).select("+password");
        if (!user) {
            return res.status(401).json({ "message": "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                "message": "Invalid email or password"
            })
        }

        const secretkey = process.env.JWT_SECRET;
        const token = jwt.sign({
            userId: user._id,
        }, secretkey, { expiresIn: "3h" });

        res.json({
            "message": "Login successful",
            token
        });

    } catch (error) {
        next(error);
    }
}


module.exports = { createUser, login };
