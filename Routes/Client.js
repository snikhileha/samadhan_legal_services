const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('../mongoose');
const upload = require('../multerConfig'); 

require('../Models/Client');
const Client = mongoose.model('Client');

router.post('/signUp-client', upload.single('image'), async (req, res) => {
    const { name, email, password, user } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'no file uploaded' });
        }
        const oldClient = await Client.findOne({ email });
        if (oldClient) {
            return res.send({ error: 'Client Exists' });
        }
        if (req.file) {
            const { path } = req.file;
            const newClient = await Client.create({
                name,
                email,
                password: encryptedPassword,
                user,
                image: path
            });
            newClient.save()
                .then(() => {
                    res.status(201).json({ message: 'Client created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to create Client' });
                });
        } else {
            const newClient = await Client.create({
                name,
                email,
                password: encryptedPassword,
                user,
            });
            newClient.save()
                .then(() => {
                    res.status(201).json({ message: 'Client created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to create Client' });
                });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });

    }
})

router.get('/getAllClient', async (req, res) => {
    try {
        const allClient = await Client.find();
        res.send({ status: "ok", data: allClient });

    } catch (error) {
        res.send({ status: "error" });
    }
})

router.get("/getClient/:clientId", async (req, res) => {
    try {
        const client = await Client.findById({ _id: req.params.clientId });
        res.send({ status: "ok", data: client });
    } catch (error) {
        res.send({ status: "error" });
    }
});

router.put("/editClient/:clientId", upload.single('image'), async (req, res) => {
    try {
        const { clientId } = req.params;
        const updateData = req.body;
        console.log(req.body);
        if (req.file) {
            const { path } = req.file;

            updateData.image = path;
            const data = await Client.findByIdAndUpdate({ _id: clientId }, { $set: updateData }, { new: true });
            data.save();
            res.send({ status: "Ok", data: data });
        } else {
            const data = await Client.findByIdAndUpdate({ _id: clientId }, { $set: updateData }, { new: true });
            data.save();
            res.send({ status: "Ok", data: data });
        }

    } catch (error) {
        res.send({ status: "error" });
    }
});

router.delete("/client/:clientId", async (req, res) => {
    const dataid = req.params.clientId;
    try {
        const data = await Client.findOneAndDelete({ _id: req.params.clientId });
        console.log(data);
        res.send({ status: "Ok", data: `Data ${dataid} Deleted` });
    } catch (error) {
        res.send({ status: "error" });
    }
});

module.exports = clientRouter;