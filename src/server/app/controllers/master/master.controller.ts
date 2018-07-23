/**
 * マスターデータ
 */
import * as COA from '@motionpicture/coa-service';
import * as debug from 'debug';
import { Request, Response } from 'express';
import { errorProsess } from '../base/base.controller';
const log = debug('fido-frontend:master');


/**
 * 券種一覧取得
 * @function getSalesTickets
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export async function getSalesTickets(req: Request, res: Response): Promise<void> {
    try {
        log('getSalesTickets');
        const args = req.query;
        const result = await COA.services.reserve.salesTicket(args);
        res.json(result);
    } catch (err) {
        errorProsess(res, err);
    }
}

/**
 * 券種マスター一覧取得
 * @function getTickets
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export async function getTickets(req: Request, res: Response): Promise<void> {
    try {
        log('getTickets');
        const args = req.query;
        const result = await COA.services.master.ticket(args);
        res.json(result);
    } catch (err) {
        errorProsess(res, err);
    }
}
