import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as restify from 'restify';

import { environment } from './../common/environment';
import { handleError } from './error.handler';
import { logger } from './../common/logger';
import { mergePatchBodyParser } from './merge-patch.parser';
import { Router } from './../common/router';
import { tokenParser } from './../security/token.parser';

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
                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '0.1.0',
                    log: logger
                };

                if (environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.security.certificate),
                    options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options);

                this.application.pre(restify.plugins.requestLogger({ log: logger }));

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);
                this.application.use(tokenParser);

                // Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

                this.application.on('restifyError', handleError);
                // (req, res, route, error)
                this.application.on('after', restify.plugins.auditLogger({
                    log: logger,
                    event: 'after',
                    body: true
                }));
            } catch (error) {
                reject(error);
            }
        });
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }

}