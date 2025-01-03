import jwt from 'jsonwebtoken';
import { RegisterModel } from '../model/Schema.js'; // Assuming RegisterModel is your Mongoose model for user registration

export const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        
        const user = await RegisterModel.findOne({ token: token });

        if (!user) {
            throw new Error('User not found');
        }

        // Store necessary data in the request object
        const rootUser = user;
        // Store necessary data in the request object
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser.id;


        next();
    } catch (err) {
        res.status(401).send('Unauthorized Token');
        console.error(err);
    }
};
