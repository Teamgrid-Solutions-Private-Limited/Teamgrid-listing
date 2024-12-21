require('dotenv').config();
const express = require('express');
const mongoose = require('./database/connect');
const errorHandler = require("./middlewares/errorHandler");
 
 

const PORT = process.env.PORT ||4000;
 

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
