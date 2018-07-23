/**
 * maintenance
 */
import * as debug from 'debug';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { errorProsess } from '../base/base.controller';
const log = debug('fido-frontend:maintenance');

export async function confirm(_req: Request, res: Response) {
    log('confirm');
    try {
        if (process.env.MAINTENANCE_TIME === undefined
            || process.env.MAINTENANCE_TIME === '') {
            res.json({
                result: false,
                maintenanceText: '',
                startDate: '',
                endDate: ''
            });

            return;
        }
        const maintenanceTime = process.env.MAINTENANCE_TIME.trim().split(',');
        const now = moment().unix();
        const start = moment(maintenanceTime[0]).unix();
        const end = moment(maintenanceTime[1]).unix();
        const maintenanceText = (process.env.MAINTENANCE_TEXT === undefined)
            ? ''
            : process.env.MAINTENANCE_TEXT;
        res.json({
            isMaintenance: (start < now && end > now),
            maintenanceText: new Buffer(maintenanceText, 'base64').toString(),
            startDate: maintenanceTime[0],
            endDate: maintenanceTime[1]
        });

    } catch (err) {
        errorProsess(res, err);
    }
}
