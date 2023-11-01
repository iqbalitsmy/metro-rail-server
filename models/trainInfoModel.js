const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Train name"],
        maxLength: [30, "Name cant not exceed 30 characters"],
        minLength: [4, "Name should have more then 4 characters"]
    },
    from: {
       place: {
            type: String,
            required: [true, "Please Enter Train Arrival Place"],
            maxLength: [30, "cant not exceed 30 characters"],
            minLength: [4, "should have more then 4 characters"]
        },
        arraival: {
            type: String,
            required: [true, "Please Enter Train Arrival Place"],
            maxLength: [30, "cant not exceed 30 characters"],
            minLength: [4, "should have more then 4 characters"]
        },
        halt: {

        },
        departure: {

        },
        duration: {
            
        },
        runsOn: {

        }

    },
    to: {
       place: {
            type: String,
            required: [true, "Please Enter Train Arrival Place"],
            maxLength: [30, "cant not exceed 30 characters"],
            minLength: [4, "should have more then 4 characters"]
        },
        time: {
            type: String,
            required: [true, "Please Enter Train Arrival Place"],
            maxLength: [30, "cant not exceed 30 characters"],
            minLength: [4, "should have more then 4 characters"]
        },
        halt: {

        },
        departure: {

        },
        duration: {

        }
    },
})


module.exports = mongoose.model("TrainInfo", userSchema);