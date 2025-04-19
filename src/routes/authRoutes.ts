import { Router } from 'express';
import { validateEmail, validateLogin, validateSignup } from '../middlewares/authValidator';
import { User, userType } from '../models/User';
import { sendResetEmail, sendVerificationEmail } from '../services/emailServices';
import { HydratedDocument } from 'mongoose';
import 'dotenv/config'
import { createAccessToken, createRefreshToken, createValidateToken, hashPassword, verifyAccessToken, verifyValidateToken } from '../utils/auth';
import { body, matchedData, query, validationResult } from 'express-validator';

const router = Router();

//LE LOGICHE BISOGNA SPOSTARLE SUI CONTROLLE
router.post("/signup",validateSignup, async (req, res) => {
    try {
        const {email, password, username} = req.body
        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            email,
            password: hashedPassword,
            username,
        });
        await user.save();
        const token = await createValidateToken({userId: String(user._id), username: user.username})
        await sendVerificationEmail(email, username, token)
        res.status(201).json({id: user._id,username: user.username, email: user.email}) 
    } catch(err) {
        res.status(404).send(err)
    }
})

router.get("/verify-email", validateEmail, async (_, res) => {
    try {
        const user = res.locals.user as HydratedDocument<userType>;
        user.emailActive = true;
        await user.save();
        res.status(200).json({message: "Email successfully verified!"})
    } catch(err) {
        res.status(500).json({message: err})
    }
})

router.post("/login", validateLogin, async (_, res) => {
    const user: HydratedDocument<userType> = res.locals.user
    const accessToken = await createAccessToken({userId: String(user._id), username: user.username})
    const refreshToken = await createRefreshToken({userId: String(user._id), username: user.username})
    
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: "antun-recipeapp.netlify.app"
    });

    res.status(200).send({accessToken})
})

router.post("/send-reset-email", async (req, res) => {

    await body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid!')
    .trim()
    .run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(400).json(errors.array().map(err => ({message: err.msg})))
        return
    }

    const {email} = matchedData(req)
    const user = await User.findOne({email})

    if(user) {
        const token = await createValidateToken({userId: String(user._id), username: user.username})
        await sendResetEmail(email, user.username,token)
    }
    res.status(200).json({ message: "If the account exists, an email with password reset instructions has been sent."});

})

router.get("/verify-reset-token", async (req, res) => {
    
    await query('resetToken')
    .notEmpty().withMessage('Token is required')
    .run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(400).json(errors.array().map(err => ({message: err.msg})))
        return
    }
    
    try {
        const verifyToken = String(req.query.resetToken)
        verifyValidateToken(verifyToken)
        res.status(200).send(true)

    } catch {
        res.status(401).send(false)
    }
    
})

router.post("/change-password", async (req,res) => {
    
    if (!req.query.username) {
        res.status(400).json({ message: 'Username query parameter is required' });
        return
    }

    await body('password').notEmpty().withMessage('Password required')
    .isStrongPassword().withMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.")
    .run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(400).json(errors.array().map(err => ({message: err.msg})))
        return
    }

        try {
        const password = String(req.body.password)
        const username = String(req.query.username)
        const hashedPassword = await hashPassword(password)
        const user = await User.findOneAndUpdate(
            { username: username },
            { $set: { 
                password: await hashPassword(password),
            }},
            { new: true }
        );
        res.status(201).json({message: "Password successfully changed!"}) 
    } catch(err) {
        res.status(404).send(err)
    }
})

router.get("/me", async (req,res) => {

    //DIVIDERE IN MIDDLEWARE
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];

        if (!accessToken) {
        res.status(401).json({message: "Access token not provided" });
        return
        }

        const user = verifyAccessToken(accessToken);

        res.status(200).json({user})
    } catch(error) {
        res.status(401).json({message: error})
    }
})

router.post("/logout", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const user = await User.findOneAndUpdate({refreshToken: refreshToken},{ $unset: { refreshToken: 1 } },{ new: true });

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true});

        if (user) {
            res.status(200).json({ message: "Logout successful!" });
            return
        } else {
            res.status(404).json({ message: "User not found!" });
            return
        }
    } else {
        res.status(400).json({ message: "Refresh token missing!" });
        return 
    }
});



export default router;

