import { Injectable } from '@angular/core';
import { factory } from '@motionpicture/sskts-api-javascript-client';
import { environment } from '../../../environments/environment';
import { SasakiService } from '../sasaki/sasaki.service';
import { SaveType, StorageService } from '../storage/storage.service';


export interface IData {
    userName?: string;
    memberType: MemberType;
    contact?: factory.person.IContact;
    creditCards: factory.paymentMethod.paymentCard.creditCard.ICheckedCard[];
    accounts: factory.pecorino.account.IAccount[];
    programMembershipOwnershipInfos: factory.ownershipInfo.IOwnershipInfo<'ProgramMembership'>[];
}

export enum MemberType {
    NotMember = '0',
    Member = '1'
}

export interface IGmoTokenObject {
    token: string;
    toBeExpiredAt: string;
    maskedCardNo: string;
    isSecurityCodeSet: boolean;
}

const STORAGE_KEY = 'user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public data: IData;

    constructor(
        private storage: StorageService,
        private sasaki: SasakiService
    ) {
        this.load();
        this.save();
    }

    /**
     * 読み込み
     * @method load
     */
    public load() {
        const data: IData | null = this.storage.load(STORAGE_KEY, SaveType.Local);
        if (data === null) {
            this.data = {
                memberType: MemberType.NotMember,
                creditCards: [],
                accounts: [],
                programMembershipOwnershipInfos: []
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
        this.storage.save(STORAGE_KEY, this.data, SaveType.Local);
    }

    /**
     * リセット
     * @method reset
     */
    public reset() {
        this.data = {
            memberType: MemberType.NotMember,
            creditCards: [],
            accounts: [],
            programMembershipOwnershipInfos: []
        };
        this.save();
    }

    /**
     * 会員初期化
     * @method initMember
     */
    public async initMember() {
        this.data.memberType = MemberType.Member;
        this.save();
        await this.sasaki.getServices();
        if (this.sasaki.userName === undefined) {
            throw new Error('userName is undefined');
        }
        // 連絡先取得
        const contact = await this.sasaki.person.getContacts({
            personId: 'me'
        });
        if (contact === undefined) {
            throw new Error('contact is undefined');
        }
        this.data.contact = contact;

        try {
            // クレジットカード検索
            const creditCards = await this.sasaki.person.findCreditCards({
                personId: 'me'
            });
            this.data.creditCards = creditCards;
        } catch (err) {
            console.log(err);
            this.data.creditCards = [];
        }

        // 口座検索
        let accounts = await this.sasaki.person.findAccounts({
            personId: 'me'
        });
        accounts = accounts.filter((account) => {
            return account.status === factory.pecorino.accountStatusType.Opened;
        });
        if (accounts.length === 0) {
            // 口座開設
            const account = await this.sasaki.person.openAccount({
                personId: 'me',
                name: this.sasaki.userName
            });
            this.data.accounts.push(account);
        } else {
            this.data.accounts = accounts;
        }

        const programMembershipOwnershipInfos = await this.sasaki.person.searchOwnershipInfos({
            ownedBy: 'me',
            goodType: 'ProgramMembership'
        });

        this.data.programMembershipOwnershipInfos = programMembershipOwnershipInfos;

        this.save();
    }

    /**
     * 口座情報更新
     * @method updateAccount
     */
    public async updateAccount() {
        await this.sasaki.getServices();
        // 口座検索
        let accounts = await this.sasaki.person.findAccounts({
            personId: 'me'
        });
        accounts = accounts.filter((account) => {
            return account.status === factory.pecorino.accountStatusType.Opened;
        });
        if (accounts.length === 0) {
            // 口座開設
            const account = await this.sasaki.person.openAccount({
                personId: 'me',
                name: this.getName()
            });
            this.data.accounts.push(account);
        } else {
            this.data.accounts = accounts;
        }
        this.save();
    }

    /**
     * 会員判定
     * @method isMember
     */
    public isMember() {
        return (this.data.memberType === MemberType.Member);
    }

    /**
     * 名前取得
     * @method getName
     */
    public getName() {
        if (this.data.contact === undefined) {
            return '';
        }
        return `${this.data.contact.familyName} ${this.data.contact.givenName}`;
    }

    /**
     * 電話番号取得（ハイフンなし）
     * @method getTelephone
     */
    public getTelephone() {
        if (this.data.contact === undefined) {
            return '';
        }
        return this.data.contact.telephone.replace(/\-/g, '');
    }

    /**
     * よく行く劇場名取得
     * @method getTheaterName
     */
    public getTheaterName(index: number) {
        const programMembershipOwnershipInfo = this.data.programMembershipOwnershipInfos[index];
        if (this.data.programMembershipOwnershipInfos.length === 0
            || programMembershipOwnershipInfo === undefined
            || programMembershipOwnershipInfo.acquiredFrom === undefined
            || programMembershipOwnershipInfo.acquiredFrom.typeOf !== factory.organizationType.MovieTheater) {
            return '';
        }

        return programMembershipOwnershipInfo.acquiredFrom.name.ja;
    }

    /**
     * よく行く劇場コード取得
     * @method getTheaterCode
     */
    public getTheaterCode(index: number) {
        const programMembershipOwnershipInfo = this.data.programMembershipOwnershipInfos[index];
        if (this.data.programMembershipOwnershipInfos.length === 0
            || programMembershipOwnershipInfo === undefined
            || programMembershipOwnershipInfo.acquiredFrom === undefined
            || programMembershipOwnershipInfo.acquiredFrom.typeOf !== factory.organizationType.MovieTheater) {
            return '';
        }

        return programMembershipOwnershipInfo.acquiredFrom.location.branchCode;
    }

    /**
     * 口座情報取得
     * @method getAccount
     */
    public getAccount(index: number) {
        if (this.data.accounts.length === 0) {
            return undefined;
        }
        return this.data.accounts[index];
    }

    /**
     * クレジットカード情報取得（表示用）
     * @method getCreditCard
     */
    public getCreditCard(index: number) {
        if (this.data.creditCards.length === 0) {
            return undefined;
        }
        return {
            cardNo: this.data.creditCards[index].cardNo,
            expire: `${this.data.creditCards[index].expire.slice(0, 2)}年 ${this.data.creditCards[index].expire.slice(2, 4)}月`
        };
    }

    /**
     * GMOトークン取得
     * @method getGmoObject
     */
    public async getGmoObject(args: {
        cardno: string;
        expire: string;
        securitycode: string;
        holdername: string;
    }) {
        const sendParam = args;
        console.log(sendParam);
        await this.sasaki.getServices();
        // 池袋
        const branchCode = (environment.production) ? '001' : '101';
        const movieTheater = await this.sasaki.organization.findMovieTheaterByBranchCode({
            branchCode: branchCode
        });
        return new Promise<IGmoTokenObject>((resolve, reject) => {
            (<any>window).someCallbackFunction = function someCallbackFunction(response: any) {
                if (response.resultCode === '000') {
                    resolve(response.tokenObject);
                } else {
                    reject(new Error(response.resultCode));
                }
            };
            const Multipayment = (<any>window).Multipayment;
            // shopId
            Multipayment.init(movieTheater.gmoInfo.shopId);
            Multipayment.getToken(sendParam, (<any>window).someCallbackFunction);
        });
    }

    /**
     * クレジットカード登録
     * @method registerCreditCard
     */
    public async registerCreditCard(gmoTokenObject: IGmoTokenObject) {
        await this.sasaki.getServices();
        // 登録
        await this.sasaki.person.addCreditCard({
            personId: 'me',
            creditCard: {
                token: gmoTokenObject.token
            }
        });
        this.data.creditCards = await this.sasaki.person.findCreditCards({
            personId: 'me'
        });
        if (this.data.creditCards.length > 1) {
            await this.deleteCreditCard();
            this.data.creditCards = await this.sasaki.person.findCreditCards({
                personId: 'me'
            });
        }

        this.save();
    }

    /**
     * クレジットカード削除
     */
    public async deleteCreditCard() {
        await this.sasaki.getServices();
        if (this.data.creditCards.length === 0) {
            return;
        }
        await this.sasaki.person.deleteCreditCard({
            personId: 'me',
            cardSeq: this.data.creditCards[0].cardSeq
        });
    }

    /**
     * 基本情報変更
     * @method updateProfile
     */
    public async updateProfile(args: {
        familyName: string;
        givenName: string;
        email: string;
        telephone: string;
        postalCode: string;
    }) {
        await this.sasaki.getServices();
        await this.sasaki.person.updateContacts({
            personId: 'me',
            contacts: {
                familyName: args.familyName,
                givenName: args.givenName,
                email: args.email,
                telephone: args.telephone
            }
        });
        const contact = await this.sasaki.person.getContacts({
            personId: 'me'
        });
        if (contact === undefined) {
            throw new Error('contact is undefined');
        }
        this.data.contact = contact;

        this.save();
    }

    /**
     * クレジットカード登録判定
     */
    public isRegisteredCreditCards() {
        return (this.data.creditCards !== undefined
            && this.data.creditCards.length > 0);
    }

}
