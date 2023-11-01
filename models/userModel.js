const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const bdPhoneValidator = function (value) {
    // Define a regular expression pattern for Bangladeshi phone numbers
    // const bangladeshPhonePattern = /^(?:\+880|0)(1[3-9]\d{8})$/;
    const bangladeshPhonePattern = /^\d{11}$/;

    if (!value) {
        return false; // If the value is empty, it's not valid
    }

    if (!bangladeshPhonePattern.test(value)) {
        return false; // If the value doesn't match the pattern, it's not valid
    }

    return true; // The value is a valid Bangladeshi phone number
};


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [30, "Name cant not exceed 30 characters"],
        minLength: [4, "Name should have more then 4 characters"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Please Enter your mobile number"],
        unique: true,
        validate: [bdPhoneValidator, "Please Enter a valid mobile number"],
    },
    // dob: {
    //     type: Date,
    //     required: [true, "Please enter your date of birth"],
    //     validate: [validator.isBefore(new Date()), "Please enter a valid date of birth"]
    // },
    dob: {
        type: Date,
        required: [true, "Please enter your date of birth"],
        validate: {
            validator: (dob) => {
                // Use isBefore function from validator package to check if the date is in the past
                return validator.isBefore(String(dob), String(new Date()));
            },
            message: "Please enter a valid date of birth"
        }
    },
    // email: {
    //     type: String,
    //     required: [true, "Please Enter your email"],
    //     unique: true,
    //     validate: [validator.isEmail, "Please Enter a valid  Email"],
    // },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [8, "Password should be greater then  8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//  save hash password on backend 

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 12);
});
// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password

userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};
// generating password reset token 

userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);