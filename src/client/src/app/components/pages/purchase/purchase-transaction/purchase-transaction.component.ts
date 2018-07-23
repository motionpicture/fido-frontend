import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PurchaseService } from '../../../../services/purchase/purchase.service';
import { SasakiService } from '../../../../services/sasaki/sasaki.service';

@Component({
    selector: 'app-purchase-transaction',
    templateUrl: './purchase-transaction.component.html',
    styleUrls: ['./purchase-transaction.component.scss']
})
export class PurchaseTransactionComponent implements OnInit {
    public parameters: {
        /**
         * パフォーマンスId
         */
        performanceId?: string;
        /**
         * WAITER許可証トークン
         */
        passportToken?: string;
        /**
         * awsCognitoIdentityId
         */
        identityId?: string;
        /**
         * ネイティブアプリ
         */
        native?: string;
        /**
         * 会員
         */
        member?: string;
        /**
         * アクセストークン
         */
        accessToken?: string;
        /**
         * signinリダイレクト
         */
        signInRedirect: boolean;
    };
    constructor(
        private router: Router,
        private sasaki: SasakiService,
        private purchase: PurchaseService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        try {
            if (this.purchase.data.individualScreeningEvent === undefined) {
                this.router.navigate(['/error']);
                return;
            }
            await this.sasaki.getServices();
            const individualScreeningEvent = this.purchase.data.individualScreeningEvent;
            // 開始可能日判定
            if (!this.purchase.isSalse(individualScreeningEvent)) {
                throw new Error('Unable to start sales');
            }
            const END_TIME = 30;
            // 終了可能日判定
            if (moment().add(END_TIME, 'minutes').unix() > moment(individualScreeningEvent.startDate).unix()) {
                throw new Error('unable to end sales');
            }

            const passport = await this.sasaki.getPassportToken(individualScreeningEvent.coaInfo.theaterCode);

            await this.purchase.transactionStartProcess({
                passportToken: passport.token,
                individualScreeningEvent: individualScreeningEvent
            });
            this.router.navigate(['/purchase/seat'], { replaceUrl: true });
        } catch (err) {
            console.error(err);
            this.router.navigate(['/error']);
        }
    }

}
