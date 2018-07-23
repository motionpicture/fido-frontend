import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@motionpicture/sskts-api-javascript-client';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { TimeFormatPipe } from '../../../../pipes/time-format/time-format.pipe';
import { SaveType, StorageService } from '../../../../services/storage/storage.service';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-purchase-complete',
    templateUrl: './purchase-complete.component.html',
    styleUrls: ['./purchase-complete.component.scss']
})
export class PurchaseCompleteComponent implements OnInit {
    public data: {
        order: factory.order.IOrder;
        transaction: factory.transaction.placeOrder.ITransaction;
        movieTheaterOrganization: factory.organization.movieTheater.IPublicFields;
        sendEmailNotification?: factory.task.sendEmailMessage.ITask
    };
    public environment = environment;

    constructor(
        private storage: StorageService,
        public user: UserService,
        private router: Router
    ) { }

    public ngOnInit() {
        window.scrollTo(0, 0);
        this.data = this.storage.load('complete', SaveType.Session);
        if (this.data === null) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 印刷
     * @method print
     */
    public print() {
        print();
    }

    /**
     * 劇場名取得
     * @method getTheaterName
     * @returns {string}
     */
    public getTheaterName() {
        const itemOffered = this.data.order.acceptedOffers[0].itemOffered;
        if (itemOffered.typeOf !== factory.reservationType.EventReservation) {
            return '';
        }

        return itemOffered.reservationFor.superEvent.location.name.ja;
    }

    /**
     * スクリーン名取得
     * @method getScreenName
     * @returns {string}
     */
    public getScreenName() {
        const itemOffered = this.data.order.acceptedOffers[0].itemOffered;
        if (itemOffered.typeOf !== factory.reservationType.EventReservation) {
            return '';
        }

        return itemOffered.reservationFor.location.name.ja;
    }

    /**
     * 作品名取得
     * @method getTitle
     * @returns {string}
     */
    public getTitle() {
        const itemOffered = this.data.order.acceptedOffers[0].itemOffered;
        if (itemOffered.typeOf !== factory.reservationType.EventReservation) {
            return '';
        }

        return itemOffered.reservationFor.name.ja;
    }

    /**
     * 鑑賞日取得
     * @method getAppreciationDate
     * @returns {string}
     */
    public getAppreciationDate() {
        const itemOffered = this.data.order.acceptedOffers[0].itemOffered;
        if (itemOffered.typeOf !== factory.reservationType.EventReservation) {
            return '';
        }
        moment.locale('ja');

        return moment(itemOffered.reservationFor.startDate).format('YYYY年MM月DD日(ddd)');
    }

    /**
     * 上映開始時間取得
     * @method getStartDate
     * @returns {string}
     */
    public getStartDate() {
        const itemOffered = this.data.order.acceptedOffers[0].itemOffered;
        if (itemOffered.typeOf !== factory.reservationType.EventReservation) {
            return '';
        }
        const timeFormat = new TimeFormatPipe();

        return timeFormat.transform(
            itemOffered.reservationFor.startDate,
            itemOffered.reservationFor.coaInfo.dateJouei
        );
    }

    /**
     * 上映終了取得
     * @method getEndDate
     * @returns {string}
     */
    public getEndDate() {
        const itemOffered = this.data.order.acceptedOffers[0].itemOffered;
        if (itemOffered.typeOf !== factory.reservationType.EventReservation) {
            return '';
        }
        const timeFormat = new TimeFormatPipe();

        return timeFormat.transform(
            itemOffered.reservationFor.endDate,
            itemOffered.reservationFor.coaInfo.dateJouei
        );
    }

}
