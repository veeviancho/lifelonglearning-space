//Import express router
const express = require('express');
const router = express.Router();

//To hash passwords
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//To protect our routes
const passport = require('passport');

//Load user model
const User = require('../../model/User');

//Load input validation
// const validateRegisterInput = require('../../validation/register');
// const validateLoginInput = require('../../validation/login');

//Load keys
const keys = require('../../config/keys')

/** 
 * @route POST api/users/register
 * @desc Register the user
 * @access Public
 */ 
router.post('/register', (req, res) => {
    // //Object restructuring
    // const { error, isValid } = validateRegisterInput(req.body);
    
    // //Validation check
    // if (!isValid) {
    //     return res.status(400).json(error);
    // };

    // Name Input Validation
    // Accepts lower/uppercase letters, space and special char (,.'-) only
    // First char must be a letter
    let check = /^[a-z]+[a-z ,.'-]*$/i;
    if (!check.test(req.body.name)) {
        return res.status(400).json ({
            msg: "Please enter a valid name.",
            info: [
                { msg: "First character must be an alphabet letter." },
                { msg: "Numbers are not accepted." }, 
                { msg: "Special characters other than space ( ), comma (,), period (.), hyphen (-) and apostrophe (') are not accepted." }
            ]
        })
    }

    // Username Input Validation
    // Accepts any word character [A-Za-z0-9], special char (.-_) only
    // No more than one special char in a row
    // Cannot begin or end with a special char
    // 3-25 characters long
    check = /^\w{1}([\w][.-_]?){3,23}\w{1}$/i;
    if (!check.test(req.body.username)) {
        return res.status(400).json ({
            msg: "Please enter a valid username.",
            info: [
                { msg: "Accept alphabet letters, numbers, period (.), hyphen (-) and underscore (_) only." },
                { msg: "No more than one special character in a row." },
                { msg: "Cannot begin or end with a special character." },
                { msg: "3 to 25 characters long." }
            ]
        });
    }

    // Email Input Validation (must be NTU email account)
    // Accepts @e.ntu.edu.sg or @ntu.edu.sg
    // First part (before '@') accepts any letter/number, special char (.-) only
    // Cannot start with number or special character (only starts with alphabet letter)
    // No more than one special char in a row
    check = /^[a-z]+[\w(-.)?]*@(e.)?ntu.edu.sg$/i
    if (!check.test(req.body.email)) {
        return res.status(400).json ({
            msg: "Please enter a valid NTU email.",
            info: [
                { msg: "Must be an NTU email account." },
                { msg: "Username accepts any letters, numbers, period (.) and hyphen (-) only." },
                { msg: "Cannot begin with a number or special character." },
                { msg: "No more than one special character in a row." }
            ]
        });
    }

    // Password Input Validation
    // Medium: At least one (uppercase, lowercase, number) and at least 6 characters
    // Only checking for medium strength
    // Strong: At least one (uppercase, lowercase, number, special char) and at least 8 characters
    // check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})|(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])(?=.{8,})/
    check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/
    if (!(check.test(req.body.password))) {
        return res.status(400).json ({
            msg: "Weak password.",
            info: [
                { msg: "At least one uppercase letter." },
                { msg: "At least one lowercase letter." },
                { msg: "At least one number." },
                { msg: "At least 6 characters." }
            ]
        })
    }

    // Confirm Password Input Validation
    if (req.body.password !== req.body.password2) {
        return res.status(400).json({
            msg: "Passwords do not match."
        })
    }

    // Search Database if Email and Username already exist
    User.findOne({ $or: [{username: req.body.username}, {email: req.body.email}] }).then(user => {
        //Unique email and username check
        if (user) {
            if (user.username === req.body.username) {
                return res.status(400).json({
                    msg: "Username is already taken."
                });
            } else {
                return res.status(400).json({
                    msg: "Email already exists. Please login now."
                });
            };  
        } else {
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                programme: req.body.programme,
                about: ''
            });
        
            //Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json({
                            user: user,
                            success: true,
                            // msg: "User successfully registered! Login now :)"
                        }))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});


/** 
 * @route POST api/users/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username }).then(user => {
        //Check if user exists
        if (!user) {
            return res.status(404).json({ 
                msg2: "User not found."
            })
        }

        //Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            //Password match, creates JWT Payload
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name
                }
                //Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 604800 // 1 week in seconds
                    },
                    (err, token) => {
                        res.json({
                            // api - sent to client side
                            success: true,
                            user: user,
                            token: 'Bearer ' + token
                        });
                    }
                )
            } else {
                return res.status(400).json({ 
                    msg2: "You have entered an incorrect password." 
                });
            }
        });
    });
});

/**
 * @route POST api/users/profile
 * @desc Return user's data
 * @access Private
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ user: req.user });
});


/**
 * @route PUT api/users/update/:id
 * @desc Update user's data
 * @access Private
 */

//TODO: passport authenticate??
router.put('/update/:id', (req, res) => {
    // Name Input Validation
    // Accepts lower/uppercase letters, space and special char (,.'-) only
    // First char must be a letter
    let check = /^[a-z]+[a-z ,.'-]*$/i;
    if (!check.test(req.body.name)) {
        return res.status(400).json ({
            msg3: "Please enter a valid name."
        })
    }

    // Username Input Validation
    // Accepts any word character [A-Za-z0-9], special char (.-_) only
    // No more than one special char in a row
    // Cannot begin or end with a special char
    // 3-25 characters long
    check = /^\w{1}([\w][.-_]?){3,23}\w{1}$/i;
    if (!check.test(req.body.username)) {
        return res.status(400).json ({
            msg3: "Please enter a valid username."
        });
    }

    //  TODO: username exist in database -> error!!

    // User.findOne({ username: req.body.username }).then(user => {
    //     //Check if user exists
    //     if (user) {
    //         return res.status(400).json({ 
    //             msg2: "Username is already taken."
    //         })
    //     }

    User.updateOne({ _id: req.params.id }, { $set: req.body })
    .then( () => {
        res.status(201).json({
            success: true
            // msg3: 'Profile updated successfully!'
        });
    })
    .catch( (err) => {
        res.status(400).json({
            msg3: err
        });
    })
});

// /**
//  * @route P api/users/forgotpw
//  * @desc Send code to user's email and Change Password
//  * @access Public
//  */

// router.put('/forgotpw', (req, res) => {

//     const email = req.body.email;

//     User.findOne({ email }).then(user => {
//         if (!user) {
//             return res.status(404).json({
//                 msg4: "Email not found."
//             })
//         }
//     })
// })


//Export router to be used elsewhere
module.exports = router;