const app = require("./app");
const database = require('./config/dbConnection');

const port = process.env.PORT;

// database connection 
database();

// home api 
app.use("/", async (req, res) => {
    res.send("Your server is working!")

});

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
});