import { Router } from 'express';
import { validateEmail, validateLogin, validateSignup } from '../middlewares/authValidator';
import { User, userType } from '../models/User';
import { sendVerificationEmail } from '../services/emailServices';
import { HydratedDocument } from 'mongoose';
import 'dotenv/config'
import { createAccessToken, createRefreshToken, createValidateToken, hashPassword } from '../utils/auth';

const router = Router();

//LE LOGICHE BISOGNA SPOSTARLE SUI CONTROLLER
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
    console.log(user)
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',  
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({accessToken})
})

export default router;

