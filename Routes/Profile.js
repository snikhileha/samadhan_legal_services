const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const mongoose = require('../mongoose');

dotenv.config({ path: './config.env' });

const JWT_SECRET = process.env.JWT;
const upload = require('../multerConfig'); 

require('../Models/Lawyer');
const Lawyer = mongoose.model('Lawyer');
require('../Models/Client');
const Client = mongoose.model('Client');


router.post('/clientProfile', async (req, res) => {
    const { token } = req.body;

    try {
        const client = jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;
        }
        );

        if (client === "token expired") {
            return res.send({ status: "error", data: "token expired" })
        }

        const clientId = client.id;
        Client.findById({ _id: clientId })
            .then((data) => {
                res.send({ status: "ok", data: data })
            })
            .catch((error) => {
                res.send({ status: "error", data: error })
            })
    } catch (error) {

    }
})

router.post('/lawyerProfile', async (req, res) => {
    const { token } = req.body;
    console.log(req.body);
    try {
        const lawyer = jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;
        }
        );

        if (lawyer === "token expired") {
            return res.send({ status: "error", data: "token expired" })
        }
        const lawyerId = lawyer.id;
        Lawyer.findById({ _id: lawyerId })
            .then((data) => {
                res.send({ status: "ok", data: data })
            })
            .catch((error) => {
                res.send({ status: "error", data: error })
            })
    } catch (error) {

    }
})

module.exports = profileRouter;