const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path:'../config.env'});
const mongoose = require('../mongoose');

const JWT_SECRET = process.env.JWT;

require('../Models/Lawyer');
const Lawyer = mongoose.model('Lawyer');
require('../Models/Admin');
const Admin = mongoose.model('Admin');
require('../Models/Client');
const Client = mongoose.model('Client');

router.post('/signIn', async (req, res) => {

    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    const lawyer = await Lawyer.findOne({ email });
    const admin = await Admin.findOne({ email });

    if (!client && !lawyer && !admin) {
        return res.json({ error: "User Not Found" });
    }
   
    if (client) {
        if (await bcrypt.compare(password, client.password)) {
            const token = jwt.sign({email:client.email,id: client.id}, JWT_SECRET, {
                expiresIn: 600
            });
            if (res.status(201)) {
                return res.json({ status: "ok", data: token, user: 'client' })
            } else {
                return res.json({ error: "error" });
            }
        }
    }
    else if (lawyer) {
        if (await bcrypt.compare(password, lawyer.password)) {
            const token = jwt.sign({email:lawyer.email,id:lawyer.id}, JWT_SECRET, {
                expiresIn: 600
            });
            if (res.status(201)) {
                return res.json({ status: "ok", data: token, user: 'lawyer' })
            } else {
                return res.json({ error: "error" });
            }
        }
    }
    else if (admin) {
        if (await bcrypt.compare(password, admin.password)) {
            const token = jwt.sign({ email: admin.email},JWT_SECRET, {
                expiresIn: 600
            });
            if (res.status(201)) {
                return res.json({ status: "ok", data: token, user: 'admin' })
            } else {
                return res.json({ error: "error" });
            }
        }
    }

    return res.json({ status: "error", error: "Invalid Password" });
})

module.exports = signInRouter;