const mongoose = require("mongoose");


const uri = `mongodb://127.0.0.1:27017/metroTrain`;
// const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.wtvr16j.mongodb.net/?retryWrites=true&w=majority`;

const database = (module.exports = async () => {
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(uri);
        console.log('database connected 🚀🚀');
    } catch (error) {
        console.log(error);
        console.log("database cant not connecting ❌❌");
    }

});


module.exports = database;