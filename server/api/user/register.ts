import zod from 'zod';
import userService from '~/server/services/userService';
import { DefaultCookie } from '~/server/services/authService';

const validateRegisterUser = zod.object({
    email: zod.string().email({ message: 'Email must be a valid email address' })
    .min(1, { message: 'Email is required' }),
    password: zod.string().min(8, { message: 'Password must be at least 8 characters long' })
    .min(1, { message: 'Password is required' }),
  });

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, validateRegisterUser.parse);
    const user = await userService.RegisterUser(body.email, body.password);

    setCookie(event, "access-token", user.access_token, {
        maxAge: 10,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });


    res.cookie("access-token", user.access_token, DefaultCookie(15 * 60 * 1000));
    res.cookie("refresh-token", user.refresh_token, DefaultCookie(7 * 24 * 60 * 60 * 1000));
    res.status(201).json(user);
});

const registerUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await userService.RegisterUser(email, password);
        res.cookie("access-token", user.access_token, DefaultCookie(15 * 60 * 1000));
        res.cookie("refresh-token", user.refresh_token, DefaultCookie(7 * 24 * 60 * 60 * 1000));
        res.status(201).json(user);
    }
    catch (e) {
        console.error("Error Registering User:", e.message);
        res.status(409).json({ message: "An error occured. Please Try Again Later." });
    }
}

const validateRegisterUserMiddleware = (req, res, next) => {
    const { error } = validateRegisterUser.validate(req.body);
    if (error) {
        console.log(error.details);
        return res
            .status(400)
            .json({ message: 'An error occurred. Please try again later.' });
    }
    next();
};
