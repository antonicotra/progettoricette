import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken'
import { UserPayload } from '../types/jwt';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken) {
        res.status(401).json({ message: 'Access Token Required!' });
        return
    }

    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_KEY!, async (err) => {
        if(err) {
            if(!refreshToken) {
                res.status(401).json({ message: 'Invalid or Expired Access Token and Refresh Token Required!' });
                return
            }

            try {
                const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY!) as UserPayload
                const user = await User.findById(payload.userId)
        
                if (!user || user.refreshToken !== refreshToken) {
                    res.status(403).json({ message: "Invalid refresh token" });
                    return
                }
        
                const newAccessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_ACCESS_TOKEN_KEY!, { expiresIn: '15m' });
                const newRefreshToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_REFRESH_TOKEN_KEY!, { expiresIn: '7d' });
                user.refreshToken = newRefreshToken;
                await user.save();
        
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.status(200).json({ accessToken: newAccessToken });
        
            } catch(err) {
                res.status(500).json({ message: "Server error, please try again later." });
            }
        }
        
    })
}