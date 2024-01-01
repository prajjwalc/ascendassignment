import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js"
import bcrypt from "bcryptjs";
import 'dotenv/config.js'

// Register a new user
export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        // create hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const createdUser = await User.create({ email, password: hashedPassword });

        // create JWT token
        const token = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // send token
        res.status(201).json({
            message: "registered",
            token,
            email,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Login a user
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // create JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // send token
        res.status(200).json({
            message: "logged in",
            token,
            email,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Get a user
export const getUser = async (req, res) => {
    const { userId } = req;
    try {
        // get user from database
        const user = await User.findOne({ where: { id: userId } });

        // send user
        res.status(200).json({ email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}