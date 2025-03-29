import { Router } from 'express';
import { validateEmail, validateSignup } from '../middlewares/authValidator';
import bcrypt  from 'bcrypt';
import { User, userType } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../services/emailServices';
import { HydratedDocument } from 'mongoose';

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
            validateEmailToken: uuidv4(),
        });
        await user.save();
        await sendVerificationEmail(email, username, user.validateEmailToken!)
        res.status(201).json({id: user._id,username: user.username, email: user.email}) 
    } catch(err) {
        res.status(404).send(err)
    }
})

router.get("/verify-email", validateEmail, async (_, res) => {
    try {
        const user = res.locals.user as HydratedDocument<userType>;
        user.emailActive = true;
        user.validateEmailToken = undefined;
        await user.save();
        res.status(200).json({message: "Email successfully verified!"})
    } catch(err) {
        res.status(500).json({message: err})
    }
})


export default router;