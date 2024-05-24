import { sign, verify, Secret } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import  bcrypt from 'bcrypt';
const saltRounds = 10;

const config = useRuntimeConfig();

interface CookieOptions{
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: boolean | "strict" | "lax" | "none";
}

export function DefaultCookie(age: number) {
    return {
        maxAge: age,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    } as CookieOptions;
}

export function GenerateJWT(userID: string) {
    const payload = {
        id: userID
    };
    const secret: Secret = config.jwt_secret;
    const options = {
        expiresIn: '15m',
    };
    const token = sign(payload, secret, options);
    return token;
}

export function GenerateRefreshToken() {
    return randomBytes(40).toString('hex');
}

export function VerifyToken(token: string) {
    const secret: Secret = config.jwt_secret;
    return verify(token, secret);
}

export function GenerateEmailResetToken() {
    return randomBytes(20).toString('hex');
}


export async function HashPassword(password: string) {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error('Hashing error:', error);
        throw error;
    }
}

export async function VerifyPassword(password: string, storedHash: string) {
    try {
        const match = await bcrypt.compare(password, storedHash);
        return match;
    } catch (error) {
        console.error('Password verification error:', error);
        throw error;
    }
}

export default{
    GenerateJWT,
    GenerateRefreshToken,
    VerifyToken,
    GenerateEmailResetToken,
    DefaultCookie,
    HashPassword,
    VerifyPassword
}