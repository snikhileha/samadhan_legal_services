const express = require('express');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();
app.use('/uploads', express.static('uploads'));

// console.log(path.join(__dirname,'../uploads'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname,'../uploads/')); 
        cb(null, process.env.UPLOADS_FOLDER ||'uploads'); 
        
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    },
  });

const upload = multer({ storage: storage });  



module.exports = upload;