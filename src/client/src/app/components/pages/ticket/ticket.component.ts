/**
 * TicketComponent
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { CallNativeService, IDeviceResult } from '../../../services/call-native/call-native.service';
import { IReservation, ReservationService } from '../../../services/reservation/reservation.service';
import { UserService } from '../../../services/user/user.service';
import { UtilService } from '../../../services/util/util.service';

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.scss']
})
/**
 * チケットホルダー
 * @class TicketComponent
 * @implements OnInit
 */
export class TicketComponent implements OnInit {
    @ViewChild(SwiperComponent) public componentRef?: SwiperComponent;
    @ViewChild(SwiperDirective) public directiveRef?: SwiperDirective;
    public config: SwiperConfigInterface;
    public isLoading: boolean;
    public reservations: IReservation[];
    public touch: boolean;
    public device: IDeviceResult;
    public alertModal: boolean;
    public errorMessage: string;
    public infoModal: boolean;
    public infoMessage: string;

    constructor(
        private router: Router,
        private reservation: ReservationService,
        public user: UserService,
        private native: CallNativeService,
        private util: UtilService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.touch = true;
        this.isLoading = true;
        this.alertModal = false;
        this.errorMessage = '';
        this.infoModal = false;
        this.infoMessage = '';
        this.reservations = [];
        const pagination: SwiperPaginationInterface = {
            el: '.swiper-pagination',
            clickable: true
        };
        this.config = {
            pagination: pagination,
            autoHeight: true
        };
        this.reservation.isMember = this.user.isMember();
        try {
            const device = await this.native.device();
            if (device === null) {
                throw new Error('device is null');
            }
            this.device = device;
            this.reservations = await this.reservation.getReservationByAppreciationDayOrder();
        } catch (err) {
            this.router.navigate(['/error', { redirect: '/ticket' }]);
            console.log(err);
        }

        this.isLoading = false;
    }

    public slideChangeTransitionStart() {
        // console.log('slideChangeTransitionStart');
        this.touch = false;
    }

    public slideChangeTransitionEnd() {
        // console.log('slideChangeTransitionEnd');
        this.touch = true;
    }

    public openAlert(message: string) {
        this.errorMessage = message;
        this.alertModal = true;
    }

    public authStart() {
        this.isLoading = true;
        this.touch = false;
    }

    public async authEnd(reservation: IReservation) {
        this.isLoading = false;
        try {
            const geolocation = await this.util.getGeolocation({
                enableHighAccuracy: true,
                timeout: 10000
            });
            // 情報表示
            // console.log('reservation', reservation);
            const latitude = 35.674019;
            const longitude = 139.738420;
            const isLatitude = (latitude - 0.000010 < geolocation.coords.latitude
                && geolocation.coords.latitude < latitude + 0.000010);
            const isLongitude = (longitude - 0.000010 < geolocation.coords.longitude
                && geolocation.coords.longitude < longitude - 0.000010);
            const isDate = (moment(reservation.reservationsFor[0].startDate).subtract(1, 'days').unix() < moment().unix()
                && moment().unix() < moment(reservation.reservationsFor[0].endDate).unix());
            this.infoMessage = `緯度: <strong>${isLatitude}</strong><br>
            ${latitude - 0.00001} <<br>
            <strong>${this.util.floor(geolocation.coords.latitude, 6)}</strong><br>
            < ${this.util.floor(latitude + 0.00001, 6)}<br>
            経度: <strong>${isLongitude}</strong><br>
            ${longitude - 0.00001} < <br>
            <strong>${this.util.floor(geolocation.coords.longitude, 6)}</strong><br>
            < ${longitude + 0.00001}<br>
            時間: <strong>${isDate}</strong><br>
            ${moment(reservation.reservationsFor[0].startDate).subtract(1, 'days').format('YYYY/MM/DD HH:mm')} <<br>
             <strong>${moment().format('YYYY/MM/DD HH:mm')}</strong> <br>
             < ${moment(reservation.reservationsFor[0].endDate).format('YYYY/MM/DD HH:mm')}`;
            this.infoModal = true;
        } catch (err) {
            this.openAlert(err.message);
        }
        if (this.directiveRef !== undefined) {
            this.directiveRef.update();
        }
        setTimeout(() => {
            this.touch = true;
        }, 0);
    }

}
