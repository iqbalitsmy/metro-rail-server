const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const cors = require("cors");
const dotenv = require("dotenv");


const user = require("./routes/userRouter")

// apply middleware 
app.use(express.json());

// cors
const corsOptions = {
    origin:'http://localhost:5173',
    'Content-Type': 'Authorization',
    "Content-type":"application/json",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(cookieParser());

// path with config file 
dotenv.config({ path: "./config/config.env" })

// user API 
app.use("/api/v1", user);

module.exports = app;