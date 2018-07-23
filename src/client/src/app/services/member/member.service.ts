import { Injectable } from '@angular/core';
import { factory } from '@motionpicture/sskts-api-javascript-client';
import { SasakiService } from '../sasaki/sasaki.service';

@Injectable({
    providedIn: 'root'
})
export class MemberService {

    constructor(
        private sasaki: SasakiService
    ) { }

    /**
     * 会員プログラム一覧取得
     */
    public async getProgramMemberships() {
        await this.sasaki.getServices();
        // 会員プログラム検索
        const programMemberships = await this.sasaki.programMembership.search({});

        return programMemberships;
    }

    /**
     * 登録
     * @method register
     */
    public async register(args: {
        theaterCode: string;
        programMembership: factory.programMembership.IProgramMembership
    }) {
        await this.sasaki.getServices();

        const branchCode = args.theaterCode;
        // 販売劇場検索
        const seller = await this.sasaki.organization.findMovieTheaterByBranchCode({
            branchCode: branchCode
        });
        if (seller === null) {
            throw new Error('販売劇場が見つかりませんでした。');
        }

        const programMembership = args.programMembership;
        if (programMembership.id === undefined
            || programMembership.offers === undefined
        ) {
            throw new Error('programMemberships is Injustice');
        }

        const offer = programMembership.offers[0];

        if (offer.identifier === undefined) {
            throw new Error('programMemberships is Injustice');
        }

        // 会員プログラム登録
        const registerProgramMembership = await this.sasaki.person.registerProgramMembership({
            personId: 'me',
            programMembershipId: programMembership.id,
            offerIdentifier: offer.identifier,
            sellerType: seller.typeOf,
            sellerId: seller.id
        });

        console.log('registerProgramMembership', registerProgramMembership);
    }

    /**
     * 登録判定
     */
    public async isRegister() {
        await this.sasaki.getServices();
        const time = 3000;
        const limit = 20;
        let count = 0;
        return new Promise<boolean>((resolve, reject) => {
            const timer = setInterval(async () => {
                try {
                    const programMembershipOwnershipInfos =
                        await this.sasaki.person.searchOwnershipInfos({
                            ownedBy: 'me',
                            goodType: 'ProgramMembership'
                        });
                    if (programMembershipOwnershipInfos.length > 0) {
                        clearInterval(timer);
                        resolve(true);
                    } else if (count > limit) {
                        clearInterval(timer);
                        resolve(false);
                    }
                    count++;
                } catch (err) {
                    reject(err);
                }
            }, time);
        });
    }

    /**
     * 退会
     * @method unRegister
     */
    public async unRegister(args: {
        ownershipInfoIdentifier: string;
    }) {
        await this.sasaki.getServices();
        await this.sasaki.person.unRegisterProgramMembership({
            personId: 'me',
            ownershipInfoIdentifier: args.ownershipInfoIdentifier
        });
    }

}
