import { Server } from './server/server';

import { restaurantsRouter } from './restaurants/restaurants.router';
import { usersRouter } from './users/users.router';

const server = new Server();
server.bootstrap([restaurantsRouter, usersRouter]).then(server => {
    console.log(`Server is listening on: ${server.application.address().port}`)
}).catch(error => {
    console.log(`Error failed to start`)
    console.error(error);

    process.exit(1);
})
 