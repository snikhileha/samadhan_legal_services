const express = require('express');
const cors = require('cors');
const app = express();
// const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const upload = require('./multerConfig'); 

const URL = process.env.URL;
const port = process.env.PORT || 5000

const CorsOptions = {
    origin: `${URL}`,
    optionSuccessStatus: 200
}
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://samadhan-legal-services.netlify.app');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     next();
// });
app.use( express.static('uploads'));
app.use(express.json());
app.use(cors(CorsOptions));
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded successfully!');
  });
  
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use('/uploads', express.static('uploads'));
// app.use( express.static('uploads'));




const adminRoute = require('./Routes/Admin');
const clientRoute = require('./Routes/Client');
const lawyerRoute = require('./Routes/Lawyer');
const profileRoute = require('./Routes/Profile');
const signInRoute = require('./Routes/Signin');

app.use('/adminRoute',adminRoute);
app.use('/clientRoute',clientRoute);
app.use('/lawyerRoute',lawyerRoute);
app.use('/profileRoute',profileRoute);
app.use('/signInRoute',signInRoute);


app.get('/', (req, res) => {
    res.send('This is the response for the GET request');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});