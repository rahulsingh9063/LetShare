const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");


//middleware to protect routes
const requireSignIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]});


const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validation
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required"
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required"
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and should be at least 6 characters"
            });
        }
        
        // Check existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Already registered please login"
            });
        }
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Save user
        const user = await new userModel({ 
            name, 
            email, 
            password: hashedPassword 
        }).save();
        
        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error: error.message
        });
    }
};

// Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            });
        }
        
        // Match password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid Password"
            });
        }
        
        // Generate JWT token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: "7d" 
        });
        
        res.status(200).send({
            success: true,
            message: "Login Successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        });
        

        

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in login",
            error: error.message
        });
    }
};

//update user controller
//update user controller
const updateUserController = async (req, res) => {
    try{
            const {name, password, email} = req.body;
             //user find
             const user = await userModel.findOne({email});
          //password validate
          if(password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and should be at least 6 characters"
            });
          } 

         const hashedPassword = password ? await hashPassword(password) : undefined;

         //updated user 
         const updatedUser = await userModel.findOneAndUpdate({email}, {
            name: name || user.name,
            password: hashedPassword || user.password
         }, {new: true});

            res.status(200).send({
                success: true,
                message: "User updated successfully",
                updatedUser
            })
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in update user",
            error: error.message
        });
    }
};

module.exports = { requireSignIn, registerController, loginController, updateUserController };