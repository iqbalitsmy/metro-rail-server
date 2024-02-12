const express = require("express");
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth");
const bodyParser = require('body-parser');


const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');

// import somethings from route
const user = require("./routes/userRoute");
const train = require("./routes/trainRoute");
const stationRoute = require("./routes/routeRoute");
const ticket = require("./routes/ticketRoute");

// apply middleware 
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed

// cors
corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, // access-control-allow-credentials:true
    optionSuccessStatus: 200,
    headers: ['Content-Type', 'Authorization'],
};


// const corsOptions = {
//     origin: 'http://localhost:5173',
//     'Content-Type': 'Authorization',
//     "Content-type": "application/json",
//     credentials: true,           
//     optionSuccessStatus: 200
// }


app.use(cors(corsOptions));

app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true
}));

// path with config file 
dotenv.config({ path: "./config/config.env" })

// user API 
app.use("/api/v1", user);
app.use("/api/v1", train);
app.use("/api/v1", stationRoute);
app.use("/api/v1", ticket);

// Authentication
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

module.exports = app;