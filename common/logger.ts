import * as bunyan from 'bunyan';

import { environment } from './environment';

export const logger = bunyan.createLogger({
    name: environment.log.name,
    level: bunyan.resolveLevel(environment.log.level)
});