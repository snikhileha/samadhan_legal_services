const express = require('express');
const router = new express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/Consultancy';

const JWT_SECRET = 'hdghwjdgwhdguwdg2iu_dwhvd(dn5465*-/*bwjh44';

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads')
    },
    filename: (req, file, callback) => {
        callback(null, `image-${file.originalname}`)
    }
})

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    }
    else {
        callback(new Error("only image is allowed"))
    }
}


const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
})

require('../Models/Client');
require('../Models/Lawyer');
const Client = mongoose.model('Client');
const Lawyer = mongoose.model('Lawyer');
// upload.single("image"),
router.post('/signUp',  async (req, res) => {

    const { userType } = req.body;
    // console.log(req.body);
    // const encryptedPassword = await bcrypt.hash(password, 10);
    if (userType === 'client') {
        const { name, email, password, userType } = req.body;
        // const {image} = req.file;
        // console.log(req.file);
        console.log(req.body);
        const encryptedPassword = await bcrypt.hash(password, 10);
        try {
            const oldClient = await Client.findOne({ email });
            if (oldClient) {
                return res.send({ error: 'Client Exists' });
            }
            const newClient = await Client.create({
                name,
                email,
                password: encryptedPassword,
                userType,
                // imagePath:image

            });

            newClient.save()
                .then(() => {
                    res.status(201).json({ message: 'Client created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to create Client' });
                });


        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
          
        }
    }
    else if (userType === 'lawyer') {
        const { name, email, password, userType, catagory, degree, experience } = req.body;
        const {image} = req.file;
        // console.log(req.body);
        const encryptedPassword = await bcrypt.hash(password, 10);
        try {
            const oldLawyer = await Lawyer.findOne({ email });
            if (oldLawyer) {
                return res.send({ error: 'Lawyer Exists' });
            }
            const newLawyer = await Lawyer.create({
                name,
                email,
                password: encryptedPassword,
                userType,
                catagory,
                degree,
                imagePath:image,
                experience
            });

            newLawyer.save()
                .then(() => {
                    res.status(201).json({ message: 'Lawyer created successfully' });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to create Lawyer' });
                });


        } catch (error) {

        }
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

router.put("/editClient/:clientId", async (req, res) => {

    try {
        const data = await Client.findByIdAndUpdate({ _id: req.params.clientId }, { $set: req.body });

        res.send({ status: "Ok", data: data });
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

router.put("/editLawyer/:lawyerId", async (req, res) => {

    try {
        const data = await Lawyer.findByIdAndUpdate({ _id: req.params.lawyerId }, { $set: req.body });

        res.send({ status: "Ok", data: data });
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


router.post('/signIn', async (req, res) => {

    const { email, password, userType } = req.body;
    console.log(req.body);
    const client = await Client.findOne({ email });
    if (!client) {
        return res.json({ error: "User Not Found" })
    }
    if (client.userType !== userType) {
        return res.json({ error: "UserType does not match" })
    }
    if (await bcrypt.compare(password, client.password)) {
        const token = jwt.sign({ email: client.email }, JWT_SECRET, {
            expiresIn: 600
        });
        if (res.status(201)) {
            return res.json({ status: "ok", data: token })
        } else {
            return res.json({ error: "error" });
        }
    }
    return res.json({ status: "error", error: "Invalid Password" });
})

router.post('/profile', async (req, res) => {
    const { token } = req.body;
    console.log(req.body);
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
        const clientEmail = client.email;
        Client.findOne({ email: clientEmail })
            .then((data) => {
                res.send({ status: "ok", data: data })
            })
            .catch((error) => {
                res.send({ status: "error", data: error })
            })
    } catch (error) {

    }
})


module.exports = router;