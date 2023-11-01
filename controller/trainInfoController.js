const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");


// create or register user======================================================================== 
exports.getAllTrainInfo = catchAsyncError(async (req, res, next) => {

    const { name, phoneNumber, password, dob } = req.body;
    const user = await User.create({
        name, phoneNumber, password, dob,
        avatar: {
            public_id: "sample is",
            url: "sample url;"
        }
    });

    sendToken(user, 201, res);

});