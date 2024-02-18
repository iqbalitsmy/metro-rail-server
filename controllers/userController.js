const User = require("../models/userModel");
const bcrypt = require("bcryptjs")

const jwt = require('jsonwebtoken');
const Ticket = require("../models/ticketModel");
const Station = require("../models/stationModel");
const jwtSecret = '4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd'


// --------register function-------------------------
exports.register = async (req, res, next) => {
  const { name, email, password, dateOfBirth, image } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (!(email && name && dateOfBirth)) {
    return res.status(400).json({ message: 'Email, name, or date of birth is missing' });
  }

  // Hash the password using bcrypt
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    // ---hash the password using bcrypt-----------
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
      dateOfBirth,
    });

    const maxAge = 24 * 60 * 60;
    const token = jwt.sign(
      { id: newUser._id, name, email, image: newUser.image, role: newUser.role },
      jwtSecret,
      {
        expiresIn: maxAge, // 24hrs in sec
      }
    );
    res.cookie('jwt', token, {
      maxAge: maxAge * 1000, // 24hrs in ms
    });
    res.status(201).json({
      message: 'User successfully created',
      user: newUser._id,
    });
  } catch (error) {
    res.status(400).json({
      message: 'User creation failed',
      error: error.message,
    });
  }
}

// exports.register = async (req, res, next) => {
//   const { name, email, password, dateOfBirth, image } = req.body;
//   // console.log(image)
//   if (password.length < 6) {
//     return res.status(400).json({ message: "Password less than 6 characters" })
//   }
//   if (!(email && name && dateOfBirth)) {
//     return res.status(400).json({ message: "Email or password is not present" })
//   }

//   // ---hash the password using bcrypt-----------
//   bcrypt.hash(password, 10).then(async (hash) => {

//     await User.create({
//       name,
//       email,
//       password: hash,
//       image,
//       dateOfBirth,
//     })
//       .then((user) => {
//         const maxAge = 24 * 60 * 60;
//         const token = jwt.sign(
//           { id: user._id, name, email, image: user.image, role: user.role },
//           jwtSecret,
//           {
//             expiresIn: maxAge, // 24hrs in sec
//           }
//         );
//         res.cookie("jwt", token, {
//           // httpOnly: true,
//           maxAge: maxAge * 1000, // 24hrs in ms
//         });
//         res.status(201).json({
//           message: "User successfully created",
//           user: user._id,
//         });
//       })
//       .catch((error) => {
//         res.status(400).json({
//           message: "User not successful created",
//           error: error.message,
//         })
//       });
//   });
// }

// --------register user by admin function-------------------------
exports.registerByAdmin = async (req, res, next) => {
  const { name, email, password, image, role, dateOfBirth } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" })
  }
  if (!(email && name && dateOfBirth, image)) {
    return res.status(400).json({ message: "Email or password is not present" })
  }

  // ---hash the password using bcrypt-----------
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      name,
      email,
      password: hash,
      image,
      role,
      dateOfBirth,
    })
      .then((user) => {
        res.status(201).json({
          message: "User successfully created",
          user: user._id,
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      });
  });
}


// --------login function-------------------------
exports.login = async (req, res, next) => {
  const { email, password } = req.body
  // Check if phoneNumber and password is provided
  if (!email || !password) {
    return res.status(400).json({
      message: "email or Password not present",
    })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: "Login not successful!!",
        error: "User not found",
      })
    } else if (user.status === "banned") {
      return res.status(400).json({
        message: "User is ban!!",
        error: "User not found",
      })
    }
    else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, name: user.name, email, role: user.role, image: user.image, status: user.status },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            // httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
          });
        } else {
          res.status(400).json({ message: "Login not successfully login" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
}


// --------logout function-------------------------
exports.logout = (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'User successfully logged out' });
};

// Get user details
exports.getUserDetails = async (req, res, next) => {
  // console.log(req.id)
  const user = await User.findById(req.id);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // console.log(user)
  res.status(200).json({ user });
}

// --------get a user from admin-------------------------
exports.user = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// --------user update-------------------------
exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  const { name, email, password, dateOfBirth, role, status } = req.body;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    if (role) {
      user.role = role;
    }

    if (dateOfBirth) {
      user.dateOfBirth = dateOfBirth;
    }
    if (status) {
      user.status = status;
    }

    if (password) {
      // Hash the password asynchronously
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    console.log(user)

    // Save the updated user
    await user.save();
    res.status(200).json(user);

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// --------get all user by admin-------------------------
exports.users = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    // console.log("Users:",users)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



// --------update basic user to an admin user-------------------------
exports.update = async (req, res, next) => {
  const { role, id } = req.body
  // Verifying if role and id is presnt
  if (role && id) {
    // Second - Verifying if the value of role is admin
    if (role === "admin") {
      // Finds the user with the id
      await User.findById(id)
        .then((user) => {
          // Third - Verifies the user is not an admin
          if (user.role !== "admin") {
            user.role = role;
            user.save()
              .then(() => res.status(201).json({ message: "Update successful", user }))
              //Monogodb error checker
              .catch((err) => {
                res
                  .status("400")
                  .json({ message: "An error occurred", error: err.message });
                process.exit(1);
              })
          } else {
            res.status(400).json({ message: "User is already an Admin" });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "An error occurred", error: error.message });
        });
    }
  } else {
    res.status(400).json({ message: "Role or Id not present" })
  }
}


// --------delete function-------------------------
exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  await User.findById(id)
    .then(user => user.deleteOne())
    .then(user =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch(error =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    )
}


// get all user email by admin
exports.usersEmail = async (req, res, next) => {
  try {
    const usersEmail = await User.find({}, 'email');
    // console.log("Users:", users)

    // Extract emails from the user objects
    // const emails = users.map(user => user.email);

    res.status(200).json(usersEmail);
  } catch (error) {
    console.error('Error fetching user emails:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// dashboard details from admin
exports.totalData = async (req, res, next) => {
  try {
    const users = await User.find();
    const tickets = await Ticket.find();
    const stations = await Station.find();
    const total = {
      totalUsers: users.length,
      totalTickets: tickets.length,
      totalStation: stations.length
    }
    res.status(200).json(total);

  } catch (error) {
    console.error('Error fetching user emails:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

// --------delete users-------------------------
exports.deleteUsers = async (req, res, next) => {
  const { ids } = req.body;

  try {
      // Use deleteMany to delete multiple route
      const result = await User.deleteMany({ _id: { $in: ids } });

      if (result.deletedCount > 0) {
          res.status(200).json({ message: "User successfully deleted", deletedCount: result.deletedCount });
      } else {
          res.status(404).json({ message: "No user found with the provided IDs" });
      }
  } catch (error) {
      res.status(400).json({ message: "An error occurred", error: error.message });
  }
};
