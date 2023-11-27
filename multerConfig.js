const express = require('express');
const multer = require('multer');
const path = require('path');


const app = express();
app.use('/uploads', express.static('uploads'));

// console.log(path.join(__dirname,'../uploads'));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname,'../uploads/')); 
        cb(null,'uploads'); 
        
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    },
  });

const upload = multer({ storage: storage });  



module.exports = upload;