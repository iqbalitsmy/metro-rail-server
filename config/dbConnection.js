const mongoose = require("mongoose");


const uri = `mongodb://127.0.0.1:27017/test`;
// const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.wtvr16j.mongodb.net/?retryWrites=true&w=majority`;

const database = (module.exports = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(uri,
            connectionParams
        );
        console.log('database connected 🚀🚀');
    } catch (error) {
        console.log(error);
        console.log("database cant not connecting ❌❌");
    }

});


module.exports = database;