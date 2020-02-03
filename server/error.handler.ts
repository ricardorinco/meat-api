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
        case 'ValidationError':
            error.statusCode = 400
            
            const messages: any[] = []
            for (let name in error.errors) {
                messages.push({message: error.errors[name].message})
            }
            
            error.toJSON = ()=>({
                errors: messages
            });
            break;
        }

        done();
}
