const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('./mongoose');
const upload = require('../multerConfig'); 

require('./Models/Lawyer');
const Lawyer = mongoose.model('Lawyer');

router.post('/signUp-lawyer', upload.single('image'), async (req, res) => {
    const { name, email, password, user, catagory, degree, experience } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldLawyer = await Lawyer.findOne({ email });
        if (oldLawyer) {
            return res.send({ error: 'Lawyer Exists' });
        }
        if (req.file) {
            const { path } = req.file;
            const newLawyer = await Lawyer.create({
                name,
                email,
                password: encryptedPassword,
                user,
                catagory,
                degree,
                image: path,
                experience
            });
            newLawyer.save()
                .then(() => {
                    res.status(201).json({ message: 'Lawyer created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to create Lawyer' });
                });
        } else {
            const newLawyer = await Lawyer.create({
                name,
                email,
                password: encryptedPassword,
                user,
                catagory,
                degree,
                experience
            });
            newLawyer.save()
                .then(() => {
                    res.status(201).json({ message: 'Lawyer created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to create Lawyer' });
                });
        }

    } catch (error) {

    }

})
router.get('/getAllLawyer', async (req, res) => {
    try {
        const allLawyer = await Lawyer.find();
        res.send({ status: "ok", data: allLawyer });

    } catch (error) {
        res.send({ status: "error" });
    }
})

router.get("/getLawyer/:lawyerId", async (req, res) => {

    try {
        const lawyer = await Lawyer.findById({ _id: req.params.lawyerId });

        res.send({ status: "ok", data: lawyer });
    } catch (error) {
        res.send({ status: "error" });
    }

});

router.put("/editLawyer/:lawyerId", upload.single('image'), async (req, res) => {
    try {
        const { lawyerId } = req.params;
        const updateData = req.body;

        if (req.file) {
            const { path } = req.file;
            updateData.image = path;
            const data = await Lawyer.findByIdAndUpdate({ _id: lawyerId }, { $set: updateData });

            res.send({ status: "Ok", data: data });
        } else {
            const data = await Lawyer.findByIdAndUpdate({ _id: lawyerId }, { $set: updateData });

            res.send({ status: "Ok", data: data });
        }
    } catch (error) {
        res.send({ status: "error" });
    }
});

router.delete("/lawyer/:lawyerId", async (req, res) => {
    const dataid = req.params.lawyerId;
    try {
        const data = await Lawyer.findOneAndDelete({ _id: req.params.lawyerId });
        console.log(data);
        res.send({ status: "Ok", data: `Data ${dataid} Deleted` });
    } catch (error) {
        res.send({ status: "error" });
    }
});

module.exports = lawyerRouter;