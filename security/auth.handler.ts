import * as jwt from 'jsonwebtoken';
import * as restify from 'restify';

import { environment } from './../common/environment';
import { NotAuthorizedError } from 'restify-errors';
import { User } from '../users/users.model';

export const authenticate: restify.RequestHandler = (req, res, next) => {
    const { email, password } = req.body;

    User.findByEmail(email, '+password')
        .then((user: User) => {
            if (user && user.matches(password)) {
                req.log.debug(
                    'User %s is authorized with profiles %j on route %s. Required profiles %j',
                    req.authenticated._id,
                    req.authenticated.profiles,
                    req.path(),
                    user.profiles
                );

                const token = jwt.sign(
                    { sub: user.email, iss: 'meat-api' },
                    environment.security.apiSecret
                );

                res.json({
                    name: user.name,
                    email: user.email,
                    accessToken: token
                });

                return next(false);
            } else {
                if(req.authenticated){
                    req.log.debug(
                        'Permission denied for %s. Required profiles: %j. User profiles: %j',
                        req.authenticated._id, user.profiles, req.authenticated.profiles
                    );
                }

                return next(new NotAuthorizedError('Invalid Credentials'));
            }
        })
        .catch(next);
};
