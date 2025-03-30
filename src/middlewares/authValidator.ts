import { Request, Response, NextFunction } from 'express';
import { body, query, ValidationChain, validationResult } from 'express-validator';
import { emailExistCustom, usernameExistCustom } from './customvalidator/userExist';
import { User } from '../models/User';
import jwt from 'jsonwebtoken'
import { UserPayload } from '../types/jwt';

export const validateSignup = async (req: Request, res: Response, next: NextFunction) => {

    const middleware: ValidationChain[] = [
        body('email')
        .notEmpty().withMessage('Email required')
        .isEmail().withMessage('Invalid email format')
        .toLowerCase(),
        body('username').notEmpty().withMessage('Username required'),
        body('password').notEmpty().withMessage('Password required'),
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

    const middleware: ValidationChain[] = [
        query('token')
        .notEmpty().withMessage('Token required!')
    ]

    await Promise.all(middleware.map(mid => mid.run(req)))
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