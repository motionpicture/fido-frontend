import { Injectable } from '@angular/core';
import * as COA from '@motionpicture/coa-service';
import { factory } from '@motionpicture/sskts-api-javascript-client';
import * as moment from 'moment';
import { TimeFormatPipe } from '../../pipes/time-format/time-format.pipe';
import { CallNativeService, IlocalNotificationArgs } from '../call-native/call-native.service';
import { SasakiService } from '../sasaki/sasaki.service';
import { SaveType, StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';

// declare const ga: Function;

export type IIndividualScreeningEvent = factory.event.individualScreeningEvent.IEventWithOffer;
export type ICustomerContact = factory.transaction.placeOrder.ICustomerContact;
export type ISalesTicketResult = COA.services.reserve.ISalesTicketResult;
type IUnauthorizedCardOfMember = factory.paymentMethod.paymentCard.creditCard.IUnauthorizedCardOfMember;
type IUncheckedCardTokenized = factory.paymentMethod.paymentCard.creditCard.IUncheckedCardTokenized;

interface IData {
    /**
     * 取引
     */
    transaction?: factory.transaction.placeOrder.ITransaction;
    /**
     * 上映イベント
     */
    individualScreeningEvent?: IIndividualScreeningEvent;
    /**
     * 劇場ショップ
     */
    movieTheaterOrganization?: factory.organization.movieTheater.IPublicFields;
    /**
     * 販売可能チケット情報
     */
    salesTickets: ISalesTicketResult[];
    /**
     * 予約座席
     */
    seatReservationAuthorization?: factory.action.authorize.offer.seatReservation.IAction;
    /**
     * 予約座席(仮)
     */
    tmpSeatReservationAuthorization?: factory.action.authorize.offer.seatReservation.IAction;
    /**
     * オーダー回数
     */
    orderCount: number;
    /**
     * GMOトークンオブジェクト
     */
    gmoTokenObject?: IGmoTokenObject;
    /**
     * 支払いクレジットカード
     */
    paymentCreditCard?: IUnauthorizedCardOfMember | IUncheckedCardTokenized;
    /**
     * クレジットカードエラー
     */
    isCreditCardError: boolean;
    /**
     * 決済情報（クレジット）
     */
    creditCardAuthorization?: {
        id: string;
    };
    /**
     * 購入者情報
     */
    customerContact?: ICustomerContact;
    /**
     * インセンティブ情報
     */
    pecorinoAwardAuthorization?: {
        id: string;
    };
    /**
     * インセンティブ
     */
    incentive: number;
    /**
     * ポイント券種情報
     */
    pointTickets: COA.services.master.ITicketResult[];
}

export interface IGmoTokenObject {
    token: string;
    toBeExpiredAt: string;
    maskedCardNo: string;
    isSecurityCodeSet: boolean;
}

/**
 * インセンティブ
 */
enum Incentive {
    WatchingMovies = 1
}

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {

    public data: IData;

    constructor(
        private storage: StorageService,
        private sasaki: SasakiService,
        private callNative: CallNativeService,
        private user: UserService
    ) {
        this.load();
    }

    /**
     * 読み込み
     * @method load
     */
    public load() {
        const data: IData | null = this.storage.load('purchase', SaveType.Session);
        if (data === null) {
            this.data = {
                salesTickets: [],
                pointTickets: [],
                orderCount: 0,
                incentive: 0,
                isCreditCardError: false
            };

            return;
        }
        this.data = data;
    }

    /**
     * 保存
     * @method save
     */
    public save() {
        this.storage.save('purchase', this.data, SaveType.Session);
    }

    /**
     * リセット
     * @method reset
     */
    public reset() {
        this.data = {
            salesTickets: [],
            pointTickets: [],
            orderCount: 0,
            incentive: 0,
            isCreditCardError: false
        };
        this.save();
    }

    /**
     * 期限切れ
     * @method isExpired
     */
    public isExpired() {
        if (this.data.transaction === undefined) {
            throw new Error('status is different');
        }
        const expires = moment(this.data.transaction.expires).unix();
        const now = moment().unix();
        let result = false;
        if (expires < now) {
            result = true;
        }

        return result;
    }

    /**
     * 販売可能時間判定
     * @method isSalseTime
     * @param {IIndividualScreeningEvent} screeningEvent
     * @returns {boolean}
     */
    public isSalseTime(screeningEvent: IIndividualScreeningEvent): boolean {
        const END_TIME = 30; // 30分前

        return (moment().unix() < moment(screeningEvent.startDate).subtract(END_TIME, 'minutes').unix());
    }

    /**
     * 販売可能判定
     * @method isSalse
     * @param {IIndividualScreeningEvent} screeningEvent
     * @returns {boolean}
     */
    public isSalse(screeningEvent: IIndividualScreeningEvent): boolean {
        const PRE_SALE = '1'; // 先行販売

        return (moment(screeningEvent.coaInfo.rsvStartDate).unix() <= moment().unix()
            || screeningEvent.coaInfo.flgEarlyBooking === PRE_SALE);
    }

    /**
     * 劇場名取得
     * @method getTheaterName
     * @returns {string}
     */
    public getTheaterName(): string {
        if (this.data.individualScreeningEvent === undefined) {
            return '';
        }
        const individualScreeningEvent = this.data.individualScreeningEvent;

        return individualScreeningEvent.superEvent.location.name.ja.replace('シネマサンシャイン', 'モーションピクチャー');
    }

    /**
     * スクリーン名取得
     * @method getScreenName
     * @returns {string}
     */
    public getScreenName(): string {
        if (this.data.individualScreeningEvent === undefined) {
            return '';
        }
        const individualScreeningEvent = this.data.individualScreeningEvent;

        return individualScreeningEvent.location.name.ja;
    }

    /**
     * 作品名取得
     * @method getTitle
     * @returns {string}
     */
    public getTitle(): string {
        if (this.data.individualScreeningEvent === undefined) {
            return '';
        }
        const individualScreeningEvent = this.data.individualScreeningEvent;

        return individualScreeningEvent.name.ja;
    }

    /**
     * 鑑賞日取得
     * @method getAppreciationDate
     * @returns {string}
     */
    public getAppreciationDate(): string {
        if (this.data.individualScreeningEvent === undefined) {
            return '';
        }
        const individualScreeningEvent = this.data.individualScreeningEvent;
        moment.locale('ja');

        return moment(individualScreeningEvent.startDate).format('YYYY年MM月DD日(ddd)');
    }

    /**
     * 上映開始時間取得
     * @method getStartDate
     * @returns {string}
     */
    public getStartDate(): string {
        if (this.data.individualScreeningEvent === undefined) {
            return '';
        }
        const individualScreeningEvent = this.data.individualScreeningEvent;
        const timeFormat = new TimeFormatPipe();

        return timeFormat.transform(
            individualScreeningEvent.startDate,
            individualScreeningEvent.coaInfo.dateJouei
        );
    }

    /**
     * 上映終了取得
     * @method getEndDate
     * @returns {string}
     */
    public getEndDate(): string {
        if (this.data.individualScreeningEvent === undefined) {
            return '';
        }
        const individualScreeningEvent = this.data.individualScreeningEvent;
        const timeFormat = new TimeFormatPipe();

        return timeFormat.transform(
            individualScreeningEvent.endDate,
            individualScreeningEvent.coaInfo.dateJouei
        );
    }

    /**
     * 合計金額計算
     * @method getTotalPrice
     */
    public getTotalPrice(): number {
        let result = 0;
        if (this.data.seatReservationAuthorization === undefined) {
            return result;
        }
        for (const offer of this.data.seatReservationAuthorization.object.offers) {
            result += offer.ticketInfo.salePrice;
        }

        return result;
    }

    /**
     * インセンティブ判定
     * @method isIncentive
     * @returns {boolean}
     */
    public isIncentive(): boolean {
        if (this.data.seatReservationAuthorization === undefined) {
            return false;
        }
        const pointTickets: COA.services.master.ITicketResult[] = [];
        for (const offer of this.data.seatReservationAuthorization.object.offers) {
            const pointTicket = this.data.pointTickets.find((ticket) => {
                return (ticket.ticketCode === offer.ticketInfo.ticketCode);
            });
            if (pointTicket !== undefined) {
                pointTickets.push(pointTicket);
            }
        }

        return (pointTickets.length !== this.data.seatReservationAuthorization.object.offers.length);
    }

    /**
     * ポイントでの予約判定
     * @method isReservePoint
     * @returns {boolean}
     */
    public isReservePoint(): boolean {
        let result = false;
        if (this.data.seatReservationAuthorization === undefined
            || this.data.pointTickets.length === 0) {
            return result;
        }
        for (const offer of this.data.seatReservationAuthorization.object.offers) {
            const pointTickets = this.data.pointTickets.filter((ticket) => {
                return (ticket.ticketCode === offer.ticketInfo.ticketCode);
            });
            if (pointTickets.length > 0) {
                result = true;
                break;
            }
        }

        return result;
    }

    /**
     * 取引開始処理
     * @method transactionStartProcess
     */
    public async transactionStartProcess(args: {
        passportToken: string;
        individualScreeningEvent: IIndividualScreeningEvent
    }) {
        // 購入データ削除
        this.reset();
        this.data.individualScreeningEvent = args.individualScreeningEvent;
        await this.sasaki.getServices();
        // 劇場のショップを検索
        this.data.movieTheaterOrganization = await this.sasaki.organization.findMovieTheaterByBranchCode({
            branchCode: this.data.individualScreeningEvent.coaInfo.theaterCode
        });
        // 取引期限
        const VALID_TIME = 150;
        const expires = moment().add(VALID_TIME, 'minutes').toDate();
        // 取引開始
        this.data.transaction = await this.sasaki.transaction.placeOrder.start({
            expires: expires,
            sellerId: this.data.movieTheaterOrganization.id,
            passportToken: args.passportToken
        });
        this.save();
    }

    /**
     * 座席開放処理
     * @method cancelSeatRegistrationProcess
     */
    public async cancelSeatRegistrationProcess() {
        if (this.data.transaction === undefined
            || this.data.tmpSeatReservationAuthorization === undefined) {
            throw new Error('status is different');
        }
        await this.sasaki.getServices();
        const cancelSeatReservationArgs = {
            transactionId: this.data.transaction.id,
            actionId: this.data.tmpSeatReservationAuthorization.id
        };
        await this.sasaki.transaction.placeOrder.cancelSeatReservationAuthorization(cancelSeatReservationArgs);
        this.data.tmpSeatReservationAuthorization = undefined;
        this.reset();
    }

    /**
     * 座席登録処理
     * @method seatRegistrationProcess
     */
    public async seatRegistrationProcess(offers: factory.offer.seatReservation.IOffer[]) {
        if (this.data.transaction === undefined
            || this.data.individualScreeningEvent === undefined) {
            throw new Error('status is different');
        }
        await this.sasaki.getServices();
        // 予約中なら座席削除
        if (this.data.tmpSeatReservationAuthorization !== undefined) {
            const cancelSeatReservationArgs = {
                transactionId: this.data.transaction.id,
                actionId: this.data.tmpSeatReservationAuthorization.id
            };
            await this.sasaki.transaction.placeOrder.cancelSeatReservationAuthorization(cancelSeatReservationArgs);
            this.data.tmpSeatReservationAuthorization = undefined;
            this.save();
        }
        // 座席登録
        const createSeatReservationAuthorizationArgs = {
            transactionId: this.data.transaction.id,
            eventIdentifier: this.data.individualScreeningEvent.identifier,
            offers: offers
        };
        this.data.tmpSeatReservationAuthorization =
            await this.sasaki.transaction.placeOrder.createSeatReservationAuthorization(createSeatReservationAuthorizationArgs);
        this.data.orderCount = 0;
        this.data.seatReservationAuthorization = undefined;
        this.save();
    }

    /**
     * 券種登録処理
     * @method ticketRegistrationProcess
     */
    public async ticketRegistrationProcess(offers: factory.offer.seatReservation.IOffer[]) {
        if (this.data.transaction === undefined
            || this.data.tmpSeatReservationAuthorization === undefined
            || this.data.individualScreeningEvent === undefined) {
            throw new Error('status is different');
        }
        await this.sasaki.getServices();
        const changeSeatReservationArgs = {
            transactionId: this.data.transaction.id,
            actionId: this.data.tmpSeatReservationAuthorization.id,
            eventIdentifier: this.data.individualScreeningEvent.identifier,
            offers: offers
        };
        this.data.seatReservationAuthorization =
            await this.sasaki.transaction.placeOrder.changeSeatReservationOffers(changeSeatReservationArgs);
        if (this.data.seatReservationAuthorization === undefined) {
            throw new Error('status is different');
        }
        if (this.data.creditCardAuthorization !== undefined) {
            // クレジットカード登録済みなら削除
            const cancelCreditCardAuthorizationArgs = {
                transactionId: this.data.transaction.id,
                actionId: this.data.creditCardAuthorization.id
            };
            await this.sasaki.transaction.placeOrder.cancelCreditCardAuthorization(cancelCreditCardAuthorizationArgs);
            this.data.creditCardAuthorization = undefined;
            this.save();
        }
        this.save();
    }

    /**
     * 購入者情報登録処理
     * @method customerContactRegistrationProcess
     */
    public async customerContactRegistrationProcess(args: factory.transaction.placeOrder.ICustomerContact) {
        if (this.data.transaction === undefined) {
            throw new Error('transaction is undefined');
        }
        await this.sasaki.getServices();
        // 入力情報を登録
        this.data.customerContact = await this.sasaki.transaction.placeOrder.setCustomerContact({
            transactionId: this.data.transaction.id,
            contact: args
        });

        this.save();
    }

    /**
     * クレジットカード支払い処理
     */
    public async creditCardPaymentProcess() {
        if (this.data.transaction === undefined
        || this.data.paymentCreditCard === undefined) {
            throw new Error('status is different');
        }
        await this.sasaki.getServices();
        if (this.data.creditCardAuthorization !== undefined) {
            // クレジットカード登録済みなら削除
            const cancelCreditCardAuthorizationArgs = {
                transactionId: this.data.transaction.id,
                actionId: this.data.creditCardAuthorization.id
            };
            await this.sasaki.transaction.placeOrder.cancelCreditCardAuthorization(cancelCreditCardAuthorizationArgs);
            this.data.creditCardAuthorization = undefined;
            this.save();
        }
        // クレジットカード登録
        const METHOD_LUMP = '1';
        const createCreditCardAuthorizationArgs = {
            transactionId: this.data.transaction.id,
            orderId: this.createOrderId(),
            amount: this.getTotalPrice(),
            method: METHOD_LUMP,
            creditCard: this.data.paymentCreditCard
        };
        this.data.creditCardAuthorization =
            await this.sasaki.transaction.placeOrder.createCreditCardAuthorization(createCreditCardAuthorizationArgs);
        this.save();
    }

    /**
     * オーダーID生成
     * @method createOrderId
     */
    private createOrderId() {
        if (this.data.seatReservationAuthorization === undefined
            || this.data.seatReservationAuthorization.result === undefined
            || this.data.individualScreeningEvent === undefined) {
            throw new Error('status is different');
        }
        const DIGITS = {
            '02': -2,
            '08': -8
        };
        const orderCount = `00${this.data.orderCount}`.slice(DIGITS['02']);
        const tmpReserveNum =
            `00000000${this.data.seatReservationAuthorization.result.updTmpReserveSeatResult.tmpReserveNum}`.slice(DIGITS['08']);
        const theaterCode = this.data.individualScreeningEvent.coaInfo.theaterCode;
        const reserveDate = moment().format('YYYYMMDD');
        this.data.orderCount += 1;
        // オーダーID 予約日 + 劇場ID(3桁) + 予約番号(8桁) + オーソリカウント(2桁)
        return `${reserveDate}${theaterCode}${tmpReserveNum}${orderCount}`;
    }

    /**
     * インセンティブ処理
     */
    public async incentiveProcess() {
        if (this.data.transaction === undefined
            || this.user.data.accounts.length === 0) {
            throw new Error('status is different');
        }
        await this.sasaki.getServices();
        this.data.pecorinoAwardAuthorization = await this.sasaki.transaction.placeOrder.createPecorinoAwardAuthorization({
            transactionId: this.data.transaction.id,
            amount: Incentive.WatchingMovies,
            toAccountNumber: this.user.data.accounts[0].accountNumber,
            notes: '鑑賞'
        });
        this.data.incentive = Incentive.WatchingMovies;
    }

    /**
     * ポイント決済処理
     */
    public async pointPaymentProcess() {
        if (this.data.transaction === undefined
            || this.user.data.accounts.length === 0
            || this.data.seatReservationAuthorization === undefined) {
            throw new Error('status is different');
        }
        await this.sasaki.getServices();
        const ticketNames = [];
        let usePoint = 0;
        for (const offer of this.data.seatReservationAuthorization.object.offers) {
            const pointTicket = this.data.pointTickets.find((ticket) => {
                return (ticket.ticketCode === offer.ticketInfo.ticketCode);
            });
            if (pointTicket === undefined) {
                continue;
            }
            ticketNames.push(`${offer.ticketInfo.ticketName} 引換`);
            usePoint += pointTicket.usePoint;
        }

        const notes = ticketNames.join(',');

        await this.sasaki.transaction.placeOrder.createPecorinoPaymentAuthorization({
            transactionId: this.data.transaction.id,
            amount: usePoint,
            fromAccountNumber: this.user.data.accounts[0].accountNumber,
            notes: notes
        });
    }

    /**
     * 購入登録処理
     */
    public async purchaseRegistrationProcess() {
        if (this.data.transaction === undefined
            || this.data.individualScreeningEvent === undefined) {
            throw new Error('status is different');
        }
        await this.sasaki.getServices();
        let order;
        try {
            const incentives = [];
            if (this.user.isMember()
                && !this.isReservePoint()
                && this.user.data.accounts.length > 0) {
                incentives.push({
                    amount: Incentive.WatchingMovies,
                    toAccountNumber: this.user.data.accounts[0].accountNumber
                });
            }
            // 取引確定
            order = await this.sasaki.transaction.placeOrder.confirm({
                transactionId: this.data.transaction.id,
                incentives: incentives
            });
        } catch (err) {
            throw err;
        }

        const complete = {
            order: order,
            transaction: this.data.transaction,
            movieTheaterOrganization: this.data.movieTheaterOrganization,
            incentive: this.data.incentive
        };
        this.storage.save('complete', complete, SaveType.Session);

        // プッシュ通知登録
        try {
            const itemOffered = order.acceptedOffers[0].itemOffered;
            if (itemOffered.typeOf !== factory.reservationType.EventReservation) {
                throw new Error('itemOffered.typeOf is not EventReservation');
            }
            const reservationFor = itemOffered.reservationFor;
            const localNotificationArgs: IlocalNotificationArgs = {
                id: Number(order.orderNumber.replace(/\-/g, '')), // ID
                title: '鑑賞時間が近づいています。', // タイトル
                text: '劇場 / スクリーン: ' + reservationFor.superEvent.location.name.ja + '/' + reservationFor.location.name.ja + '\n' +
                    '作品名: ' + reservationFor.workPerformed.name + '\n' +
                    '上映開始: ' + moment(reservationFor.startDate).format('YYYY/MM/DD HH:mm'), // テキスト
                trigger: {
                    at: moment(reservationFor.startDate).subtract(30, 'minutes').toISOString() // 通知を送る時間（ISO）
                },
                foreground: true // 前面表示（デフォルトは前面表示しない）
            };
            this.callNative.localNotification(localNotificationArgs);
        } catch (err) {
            console.error(err);
        }

        // 購入情報削除
        this.reset();
    }
}
