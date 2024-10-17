import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@spetsartickets/common';
import { User } from '../models/user';
import { BadRequestError } from '@spetsartickets/common';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin', 
[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
],
validateRequest,
async (req: Request, res: Response) => {
    const {email, password} = req.body;
    console.log('here')
    const existingUser = await User.findOne({email})
    if(!existingUser) throw new BadRequestError('Invalid credentials');

    const passwordsMath = await Password.compare(
        existingUser.password,
        password
    )
    
    if(!passwordsMath) throw new BadRequestError('Invalid credentials');

    // Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },
        process.env.JWT_KEY!
    );
    req.session = {
        jwt: userJwt
    };


    res.status(200).send(existingUser);
});

export { router as signinRouter };