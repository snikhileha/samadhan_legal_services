const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const sharp = require('sharp');
const URL = process.env.URL;

const port = process.env.PORT || 5000


const JWT_SECRET = 'hdghwjdgwhdguwdg2iu_dwhvd(dn5465*-/*bwjh44';

const url = 'mongodb+srv://snehajoshi1895:UymMktsxS8qk3PlX@samadhan.hxseuho.mongodb.net/?retryWrites=true&w=majority';

const CorsOptions = {
    origin: `${URL}`,
    optionSuccessStatus: 200
}

app.use(express.json());
app.use(cors(CorsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect(url, {
    useNewUrlParser: true
}).then(() => { console.log("connected to database"); })
    .catch((e) => console.log(e));



app.use('/uploads', express.static('uploads'));

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads')
    },
    filename: (req, file, callback) => {
        callback(null, `image-${file.originalname}-${Date.now()}`)
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
    fileFilter: isImage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB in bytes
    },
});

app.get('/', (req, res) => {
    // Handle the GET request
    res.send('This is the response for the GET request');
});

require('./Models/Client');
require('./Models/Lawyer');
require('./Models/Admin');
const Client = mongoose.model('Client');
const Lawyer = mongoose.model('Lawyer');
const Admin = mongoose.model('Admin');

app.post('/signUp-client', upload.single('image'), async (req, res) => {



    const { name, email, password, user } = req.body;
    

    // console.log(req.body);
    // console.log(req.file);
    const encryptedPassword = await bcrypt.hash(password, 10);


    try {

        const oldClient = await Client.findOne({ email });
        if (oldClient) {
            return res.send({ error: 'Client Exists' });
        }
        if(req.file){
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
    
    
        }else{
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
    //
})

app.post('/signUp-lawyer', upload.single('image'), async (req, res) => {


    const { name, email, password, user, catagory, degree, experience } = req.body;
   

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldLawyer = await Lawyer.findOne({ email });
        if (oldLawyer) {
            return res.send({ error: 'Lawyer Exists' });
        }
        if(req.file){
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
    
    
        }else{
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

app.post('/signUp-admin', upload.single('image'), async (req, res) => {



    const { name, email, password, user } = req.body;
    // const { path } = req.file;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldAdmin = await Admin.findOne({ email });
        if (oldAdmin) {
            return res.send({ error: 'Admin Exists' });
        }
        if(req.file){
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

        }else{
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
// app.post('/signUp', upload.single('image'), async (req, res) => {


//     if (req.body.user === 'client') {
//         const { name, email, password, user } = req.body;
//         const { path } = req.file;

//         console.log(req.body);
//         console.log(req.file);
//         const encryptedPassword = await bcrypt.hash(password, 10);


//         try {

//             const oldClient = await Client.findOne({ email });
//             if (oldClient) {
//                 return res.send({ error: 'Client Exists' });
//             }

//             const newClient = await Client.create({
//                 name,
//                 email,
//                 password: encryptedPassword,
//                 user,
//                 image: path

//             });

//             newClient.save()
//                 .then(() => {
//                     res.status(201).json({ message: 'Client created successfully' });
//                 })
//                 .catch(error => {
//                     res.status(500).json({ error: 'Failed to create Client' });
//                 });


//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'An error occurred' });

//         }
//     }
//     else if (req.body.user === 'lawyer') {
//         const { name, email, password, user, catagory, degree, experience } = req.body;
//         const { path } = req.file;
//         // console.log(req.body);
//         // console.log(req.file);
//         const encryptedPassword = await bcrypt.hash(password, 10);
//         try {
//             const oldLawyer = await Lawyer.findOne({ email });
//             if (oldLawyer) {
//                 return res.send({ error: 'Lawyer Exists' });
//             }
//             const newLawyer = await Lawyer.create({
//                 name,
//                 email,
//                 password: encryptedPassword,
//                 user,
//                 catagory,
//                 degree,
//                 image: path,
//                 experience
//             });

//             newLawyer.save()
//                 .then(() => {
//                     res.status(201).json({ message: 'Lawyer created successfully' });
//                 })
//                 .catch(error => {
//                     res.status(500).json({ error: 'Failed to create Lawyer' });
//                 });


//         } catch (error) {

//         }
//     }
//     else if (req.body.user === 'admin') {
//         const { name, email, password, user,secretKey } = req.body;
//         const { path } = req.file;
//         // console.log(req.body);
//         // console.log(req.file);
//         const encryptedPassword = await bcrypt.hash(password, 10);
//         try {
//             const oldAdmin = await Admin.findOne({ email });
//             if (oldAdmin) {
//                 return res.send({ error: 'Admin Exists' });
//             }
//             const newAdmin = await Admin.create({
//                 name,
//                 email,
//                 password: encryptedPassword,
//                 user,
//                 secretKey,
//                 image: path,

//             });

//             newAdmin.save()
//                 .then(() => {
//                     res.status(201).json({ message: 'Admin created successfully' });
//                 })
//                 .catch(error => {
//                     res.status(500).json({ error: 'Failed to created Admin' });
//                 });


//         } catch (error) {

//         }
//     }

// })


app.get('/getAllClient', async (req, res) => {
    try {
        const allClient = await Client.find();
        res.send({ status: "ok", data: allClient });

    } catch (error) {
        res.send({ status: "error" });
    }
})

app.get("/getClient/:clientId", async (req, res) => {

    try {
        const client = await Client.findById({ _id: req.params.clientId });

        res.send({ status: "ok", data: client });
    } catch (error) {
        res.send({ status: "error" });
    }

});

// app.put("/editClient/:clientId", async (req, res) => {

//     try {
//         const data = await Client.findByIdAndUpdate({ _id: req.params.clientId }, { $set: req.body });

//         res.send({ status: "Ok", data: data });
//     } catch (error) {
//         res.send({ status: "error" });
//     }
// });

app.put("/editClient/:clientId", upload.single('image'), async (req, res) => {
    try {
        const { clientId } = req.params;
        const updateData = req.body;

        if (req.file) {
            const {path}=req.file;
            // Process the uploaded image using sharp or other image manipulation library
            // const processedImage = await sharp(req.file.buffer)
            //     .resize(800, 600)
            //     .toBuffer();
            updateData.image = path; // Update the image field in the updateData object with the processed image
            const data = await Client.findByIdAndUpdate({ _id: clientId }, { $set: updateData });

            res.send({ status: "Ok", data: data });
        }else{
            const data = await Client.findByIdAndUpdate({ _id: clientId }, { $set: updateData });

            res.send({ status: "Ok", data: data });
        }
       
        // const data = await Client.findByIdAndUpdate({ _id: clientId }, { $set: updateData });

        // res.send({ status: "Ok", data: data });
    } catch (error) {
        res.send({ status: "error" });
    }
});



app.delete("/client/:clientId", async (req, res) => {
    const dataid = req.params.clientId;
    try {
        const data = await Client.findOneAndDelete({ _id: req.params.clientId });
        console.log(data);
        res.send({ status: "Ok", data: `Data ${dataid} Deleted` });
    } catch (error) {
        res.send({ status: "error" });
    }
});

app.get('/getAllLawyer', async (req, res) => {
    try {
        const allLawyer = await Lawyer.find();
        res.send({ status: "ok", data: allLawyer });

    } catch (error) {
        res.send({ status: "error" });
    }
})

app.get("/getLawyer/:lawyerId", async (req, res) => {

    try {
        const lawyer = await Lawyer.findById({ _id: req.params.lawyerId });

        res.send({ status: "ok", data: lawyer });
    } catch (error) {
        res.send({ status: "error" });
    }

});

app.put("/editLawyer/:lawyerId", async (req, res) => {

    try {
        const data = await Lawyer.findByIdAndUpdate({ _id: req.params.lawyerId }, { $set: req.body });

        res.send({ status: "Ok", data: data });
    } catch (error) {
        res.send({ status: "error" });
    }
});


app.delete("/lawyer/:lawyerId", async (req, res) => {
    const dataid = req.params.lawyerId;
    try {
        const data = await Lawyer.findOneAndDelete({ _id: req.params.lawyerId });
        console.log(data);
        res.send({ status: "Ok", data: `Data ${dataid} Deleted` });
    } catch (error) {
        res.send({ status: "error" });
    }
});


app.post('/signIn', async (req, res) => {

    const { email, password } = req.body;
    console.log(req.body);
    const client = await Client.findOne({ email });
    const lawyer = await Lawyer.findOne({ email });
    const admin = await Admin.findOne({ email });

    if (!client && !lawyer && !admin) {
        return res.json({ error: "User Not Found" });
    }
    // if (client.userType !== user) {
    //     return res.json({ error: "UserType does not match" })
    // }
    if (client) {
        if (await bcrypt.compare(password, client.password)) {
            const token = jwt.sign({ email: client.email }, JWT_SECRET, {
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
            const token = jwt.sign({ email: lawyer.email }, JWT_SECRET, {
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
            const token = jwt.sign({ email: admin.email }, JWT_SECRET, {
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

app.post('/signIn', async (req, res) => {

    const { email, password, user } = req.body;
    console.log(req.body);
    const client = await Client.findOne({ email });
    if (!client) {
        return res.json({ error: "User Not Found" })
    }
    if (client.userType !== user) {
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

app.post('/profile', async (req, res) => {
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




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});