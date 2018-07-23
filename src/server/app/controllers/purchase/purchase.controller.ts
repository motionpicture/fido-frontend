/**
 * 購入
 */
import * as COA from '@motionpicture/coa-service';
import * as debug from 'debug';
import { Request, Response } from 'express';
import { errorProsess } from '../base/base.controller';
const log = debug('fido-frontend:purchase');

/**
 * 座席ステータス取得
 * @function getSeatState
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export async function getSeatState(req: Request, res: Response): Promise<void> {
    log('getSeatState');
    try {
        const args = req.query;
        const result = await COA.services.reserve.stateReserveSeat(args);
        res.json(result);
    } catch (err) {
        errorProsess(res, err);
    }
}
