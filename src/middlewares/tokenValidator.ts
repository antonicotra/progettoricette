import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken'
import { verifyRefreshToken, createAccessToken, createRefreshToken } from '../utils/auth';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken) {
        res.status(401).json({ message: 'Access Token Required!' });
        return
    }

    try {
        const token = verifyRefreshToken(refreshToken)
        const user = await User.findById(token.userId)
        if(!user){
            res.status(403).json({ message: "Invalid refresh token" });
            return
        }
        const newAccessToken = await createAccessToken({ userId: String(user._id), username: user.username })
        res.locals.accessToken = newAccessToken
        res.locals.user = user
        next()
    } catch (e) {
        if (!refreshToken) {
            res.status(401).json({ message: 'Invalid or Expired Access Token and Refresh Token Required!' });
            return
        }
        const payload = verifyRefreshToken(accessToken)
        const user = await User.findById(payload.userId)

        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ message: "Invalid refresh token" });
            return
        }

        const newAccessToken = await createAccessToken({ userId: String(user._id), username: user.username })
        const newRefreshToken = await createRefreshToken({ userId: String(user._id), username: user.username })
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.locals.accessToken = newAccessToken
        res.locals.user = user
        next();
    }
}