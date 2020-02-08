import * as mongoose from 'mongoose';
import * as restify from 'restify';

import { environment } from './../common/environment';
import { handleError } from './error.handler';
import { mergePatchBodyParser } from './merge-patch.parser';
import { Router } from './../common/router';

export class Server {

    application: restify.Server;

    bootstrap(routers: Router[] = []): Promise<Server> {
        (<any>mongoose).Promise = global.Promise;
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this)
        );
    }

    initializeDb() {
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
        });
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '0.1.0'
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);

                // Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

                this.application.on('restifyError', handleError);
            } catch (error) {
                reject(error);
            }
        });
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }

}