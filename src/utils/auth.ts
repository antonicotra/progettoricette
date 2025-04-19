import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken'
import { UserPayload } from '../types/jwt';
import 'dotenv/config'

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10)

export const createValidateToken = async (payload: UserPayload) => jwt.sign(payload, process.env.JWT_VERIFY_KEY!, { expiresIn: '1h' })

export const createAccessToken = async (payload: UserPayload) => jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_KEY!, { expiresIn: '15m' })

export const createRefreshToken = async (payload: UserPayload) => jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_KEY!, { expiresIn: '7d' })

export const verifyRefreshToken = (refreshToken: string): UserPayload => {
    const token = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY!)
    if(typeof token == 'object') return token as UserPayload
    throw new Error(token)
} 

export const verifyAccessToken = (accessToken: string): UserPayload => {
    const token = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_KEY!)
    if(typeof token == 'object') return token as UserPayload
    throw new Error(token)
} 

export const verifyValidateToken = (validateToken: string): UserPayload => {
    const token = jwt.verify(validateToken, process.env.JWT_VERIFY_KEY!)
    if(typeof token == 'object') return token as UserPayload
    throw new Error(token)
} 

