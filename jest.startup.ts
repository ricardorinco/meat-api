import * as jestCli from 'jest-cli';

import { environment } from './common/environment'
import { Restaurant } from './restaurants/restaurants.model'
import { restaurantsRouter } from './restaurants/restaurants.router'
import { Review } from './reviews/reviews.model'
import { reviewsRouter } from './reviews/reviews.router'
import { Server } from './server/server'
import { User } from './users/users.model'
import { usersRouter } from './users/users.router'

let server: Server;

const beforeAllTests = () => {
    environment.db.url = 'mongodb://localhost:27017/meat-api-test-db';
    environment.server.port = process.env.SERVER_PORT || 3001;
    server = new Server();

    return server.bootstrap([usersRouter, reviewsRouter, restaurantsRouter])
        .then(() => User.remove({}).exec())
        .then(() => {
            let admin = new User();
            admin.name = 'admin';
            admin.email = 'admin@email.com'
            admin.password = '123456',
            admin.profiles = ['admin', 'user'];

            return admin.save();
        })
        .then(() => Review.remove({}).exec())
        .then(() => Restaurant.remove({}).exec());
}

const afterAllTests = () => {
    return server.shutdown();
}

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
