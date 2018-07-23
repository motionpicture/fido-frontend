"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * マスターデータ
 */
const COA = require("@motionpicture/coa-service");
const debug = require("debug");
const base_controller_1 = require("../base/base.controller");
const log = debug('fido-frontend:master');
/**
 * 券種一覧取得
 * @function getSalesTickets
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function getSalesTickets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            log('getSalesTickets');
            const args = req.query;
            const result = yield COA.services.reserve.salesTicket(args);
            res.json(result);
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getSalesTickets = getSalesTickets;
/**
 * 券種マスター一覧取得
 * @function getTickets
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
function getTickets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            log('getTickets');
            const args = req.query;
            const result = yield COA.services.master.ticket(args);
            res.json(result);
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getTickets = getTickets;
