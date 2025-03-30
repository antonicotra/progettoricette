import { Router } from 'express';
import { validateEmail, validateSignup } from '../middlewares/authValidator';
import bcrypt  from 'bcrypt';
import { User, userType } from '../models/User';
import { sendVerificationEmail } from '../services/emailServices';
import { HydratedDocument } from 'mongoose';
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const router = Router();

//LE LOGICHE BISOGNA SPOSTARLE SUI CONTROLLER
router.post("/signup",validateSignup, async (req, res) => {
    try {
        const {email, password, username} = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            password: hashPassword,
            username,
        });
        await user.save();
        const token = jwt.sign({userId: user._id, username: user.username}, process.env.JWT_KEY!, { expiresIn: '1h' })
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


export default router;