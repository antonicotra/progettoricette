import { Request, Response, NextFunction } from 'express';
import { userType } from '../models/User';

export const isUserVerified = async (req: Request, res: Response, next: NextFunction) => {

    const user: userType = res.locals.user

    if(!user.emailActive) {
        res.status(401).json({message: "It is necessary to verify your email."})
        return
    }
    next()
}