import { Request, Response, NextFunction } from 'express';
import { body, query, ValidationChain, validationResult } from 'express-validator';
import { emailExistCustom, usernameExistCustom } from './customvalidator/userExist';
import { User } from '../models/User';
import jwt from 'jsonwebtoken'
import { UserPayload } from '../types/jwt';
import bcrypt  from 'bcrypt';

export const validateSignup = async (req: Request, res: Response, next: NextFunction) => {

    const middleware: ValidationChain[] = [
        body('email')
        .notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email format')
        .toLowerCase(),
        body('username').notEmpty().withMessage('Username required'),
        body('password').notEmpty().withMessage('Password required')
        .isStrongPassword().withMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.")
    ]

    await Promise.all(middleware.map(mid => mid.run(req)))
    const errors = validationResult(req)

    try {
        emailExistCustom
        usernameExistCustom
    } catch(err) {
        res.status(409).json({message: err})
        return
    }
    
    
    if(!errors.isEmpty()) {
        res.status(400).json(errors.array().map(err => ({message: err.msg})))
    } else next()
}

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {

    await query('token')
        .notEmpty().withMessage('Token required!')
        .run(req);

    const errors = validationResult(req)

    try {
        const decoded = jwt.verify(req.query.token as string, process.env.JWT_KEY!) as UserPayload
        const user = await User.findOne({
            _id: decoded.userId,
            username: decoded.username,
        });
        if(!user) throw new Error('Invalid token!');
        if(user.emailActive) throw new Error('Email already verified')
        res.locals.user = user;
    } catch(err) {
        res.status(401).json({message: err})
        return
    }

    if(!errors.isEmpty()) {
        res.status(400).json(errors.array().map(err => ({message: err.msg})))
    } else next()
}

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const middleware: ValidationChain[] = [
        body('email')
          .isEmail().withMessage('Email must be valid'),
        body('password').trim()
        .notEmpty().withMessage('You must supply a password')
    ]

    await Promise.all(middleware.map(mid => mid.run(req)))
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(400).json(errors.array().map(err => ({message: err.msg})))
        return
    }

    try {
        const {email, password} = req.body //METTERE MATCHED()

        const user = await User.findOne({email})
        if(!user) {
            res.status(401).json({message: "Invalid Credentials"})
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            res.status(401).json({message: "Invalid Credentials"})
            return
        }
        res.locals.user = user;
        next()
    } catch(err) {
        res.status(500).json({ message: 'Server error during login verification' });
    }
}