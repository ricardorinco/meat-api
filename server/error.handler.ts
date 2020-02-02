import * as restify from 'restify';

export const handleError = (req: restify.Request, res: restify.Response, error, done) => {

    error.toJSON = () => {
        return {
            message: error.message
        };
    }

    switch (error.name) {
        case 'MongoError':
            if (error.code === 11000) {
                error.statusCode = 400;
            }
            break;
        case 'ValidatorError':
            error.statusCode = 400;
            break;
    }

    done();
}