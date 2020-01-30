import * as restify from 'restify';
import { environment } from './../common/environment';
import { Router } from './../common/router';
import * as mongoose from 'mongoose';

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

                // Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                
                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}