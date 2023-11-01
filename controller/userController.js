
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");


// create or register user======================================================================== 
exports.registerUser = catchAsyncError(async (req, res, next) => {

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
// login user ===========================================================================================
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { phoneNumber, password } = req.body;
    // if user try to login without phone and password
    if (!phoneNumber || !password) {
        return next(new ErrorHandler("Plz Enter valid phone number and password", 400))
    }
    // find user on database using phone number and password 
    const user = await User.findOne({ phoneNumber }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid phone number or password", 401))
    }
    // compare password ,DB saved password with user login given password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid phone number or password", 401));
    }
    sendToken(user, 200, res)
});

// logout user=====================================================================================================
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// get user details =====================================================================================================
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    })
  
  });
  
// Forgot Password=======================================================================================================
// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });
  
//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }
  
//     // Get ResetPassword Token
//     const resetToken = user.getResetPasswordToken();
  
//     await user.save({ validateBeforeSave: false });
  
//     //  deploy korar time ai ta use kora lagbe tai akhon comment kore dilm
//     // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    
//   // demo url 
//   const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
//     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: `E-commerce Password Recovery`,
//         message,
//       });
  
//       res.status(200).json({
//         success: true,
//         message: `Email sent to ${user.email} successfully`,
//       });
//     } catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
  
//       await user.save({ validateBeforeSave: false });
  
//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

  // Reset Password==================================================================================================
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  
  // update user password ==========================================================================================

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
  
    }
  
    user.password = req.body.newPassword;
    await user.save();
  
    sendToken(user, 200, res);
  
  })

  // update user profile=================================================================================================
  
//   exports.updateProfile = catchAsyncError(async (req, res, next) => {
  
//     const newUserData = {
//       name: req.body.name,
//       email: req.body.email,
//     };
  
//     //  add cloudinary 
//     if(req.body.avatar !== ""){
//        const user = await User.findById(req.user.id);
//        const imageId = user.avatar.public_id;
//        await cloudinary.v2.uploader.destroy(imageId);
//        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
//         folder: "avater",
//         width:150,
//         crop:"scale",
//        });
//       newUserData.avatar ={
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       }; 
//     }
//     const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false
//     });
  
//     res.status(200).json({
//       success: true,
//       user,
//     })
  
//   });
  

// get all user by admin=============================================================================

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    })
  })
  //  get single user by admin ==========================================================================

exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHandler(`user does not exist id :${req.params.id}`));
    }
  
    res.status(200).json({
      success: true,
      user,
    })
  });
  
  // update user role ==========================================================
  exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  
  
  
  // DELETE USER============================================================
  
  exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    // there user params bcz this request will send by admin bt is this request will send bt user then i write (req.user.id)
    if (!user) {
      {
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`, 400));
      }
    }
    await user.remove();
    res.status(200).json({
      success: true,
      message: "user deleted Successfully",
    })
  })