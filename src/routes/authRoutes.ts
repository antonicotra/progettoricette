import { Router } from 'express';
import { validateEmail, validateLogin, validateSignup } from '../middlewares/authValidator';
import { User, userType } from '../models/User';
import { sendResetEmail, sendVerificationEmail } from '../services/emailServices';
import { HydratedDocument } from 'mongoose';
import 'dotenv/config'
import { createAccessToken, createRefreshToken, createValidateToken, hashPassword } from '../utils/auth';
import { body, matchedData, query, validationResult } from 'express-validator';

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
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, //IMPOSARE SU TRUE IN PRODUZIONE
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
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

router.post("/reset-password", async (req, res) => {
    
    //INSERIRE IL CAMPO PASSWORD E CONFERMA PASSWORD CHE MI VERRA' INVIATO TRAMITE BODY
    await query('resetToken')
    .notEmpty().withMessage('Token is required')
    .run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(400).json(errors.array().map(err => ({message: err.msg})))
        return
    }

    //VERIFICO CHE IL JWT E' ANCORA VALIDO


})



export default router;

