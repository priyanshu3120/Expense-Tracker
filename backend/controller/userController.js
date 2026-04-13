const userModel = require('../db/userModel');
const { error, success } = require('../utils/handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send(error(400, "Email and password are required."));
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.send(error(401, "No account found with this email. Please sign up."));
        }

        // Detect if password is a bcrypt hash (new account) or plain text (old account)
        const isBcryptHash = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
        let isMatch = false;

        if (isBcryptHash) {
            // New account — compare with bcrypt
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Old account — plain text comparison (backward compatibility)
            isMatch = (password === user.password);
            if (isMatch) {
                // Upgrade to bcrypt so future logins are secure
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            }
        }

        if (!isMatch) {
            return res.send(error(401, "Incorrect password. Please try again."));
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.send(success(201, {
            token,
            user: { _id: user._id, username: user.username, email: user.email }
        }));
    } catch (err) {
        return res.send(error(500, "Something went wrong. Please try again."));
    }
};

const signupContorller = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.send(error(400, "All fields are required."));
        }
        if (password.length < 6) {
            return res.send(error(400, "Password must be at least 6 characters."));
        }

        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.send(error(409, "An account with this email already exists."));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({ username, email, password: hashedPassword });

        return res.send(success(201, "Account created successfully. Please log in."));
    } catch (err) {
        return res.send(error(500, "Something went wrong. Please try again."));
    }
};

const logoutController = async (req, res) => {
    // JWT is stateless; logout is handled client-side by deleting the token.
    return res.send(success(200, "Logged out successfully."));
};

module.exports = {
    loginController,
    logoutController,
    signupContorller
};