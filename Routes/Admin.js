const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('../mongoose');
const upload = require('../multerConfig'); 

require('../Models/Admin');
const Admin = mongoose.model('Admin');

router.post('/signUp-admin', upload.single('image'), async (req, res) => {
    const { name, email, password, user } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldAdmin = await Admin.findOne({ email });
        if (oldAdmin) {
            return res.send({ error: 'Admin Exists' });
        }
        if (req.file) {
            const { path } = req.file;
            const newAdmin = await Admin.create({
                name,
                email,
                password: encryptedPassword,
                user,
                secretKey,
                image: path,
            });

            newAdmin.save()
                .then(() => {
                    res.status(201).json({ message: 'Admin created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to created Admin' });
                });

        } else {
            const newAdmin = await Admin.create({
                name,
                email,
                password: encryptedPassword,
                user,
            });
            newAdmin.save()
                .then(() => {
                    res.status(201).json({ message: 'Admin created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to created Admin' });
                });

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });

    }

})

router.get('/getAllAdmin', async (req, res) => {
    try {
        const allAdmin = await Admin.find();
        res.send({ status: "ok", data: allAdmin });

    } catch (error) {
        res.send({ status: "error" });
    }
})

router.get("/getAdmin/:adminId", async (req, res) => {

    try {
        const admin = await Admin.findById({ _id: req.params.adminId });

        res.send({ status: "ok", data: admin });
    } catch (error) {
        res.send({ status: "error" });
    }

});

router.put("/editAdmin/:adminId", upload.single('image'), async (req, res) => {
    try {
        const { adminId } = req.params;
        const updateData = req.body;

        if (req.file) {
            const { path } = req.file;

            updateData.image = path;
            const data = await Admin.findByIdAndUpdate({ _id: adminId }, { $set: updateData });

            res.send({ status: "Ok", data: data });
        } else {
            const data = await Admin.findByIdAndUpdate({ _id: adminId }, { $set: updateData });

            res.send({ status: "Ok", data: data });
        }

    } catch (error) {
        res.send({ status: "error" });
    }
});

router.delete("/admin/:adminId", async (req, res) => {
    const dataid = req.params.adminId;
    try {
        const data = await Admin.findOneAndDelete({ _id: req.params.adminId });
        console.log(data);
        res.send({ status: "Ok", data: `Data ${dataid} Deleted` });
    } catch (error) {
        res.send({ status: "error" });
    }
});

module.exports = router;