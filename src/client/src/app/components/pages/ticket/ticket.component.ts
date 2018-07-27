/**
 * TicketComponent
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { CallNativeService, IDeviceResult } from '../../../services/call-native/call-native.service';
import { IReservation, ReservationService } from '../../../services/reservation/reservation.service';
import { UserService } from '../../../services/user/user.service';

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

    constructor(
        private router: Router,
        private reservation: ReservationService,
        public user: UserService,
        private native: CallNativeService
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

    public authEnd() {
        this.isLoading = false;
        if (this.directiveRef !== undefined) {
            this.directiveRef.update();
        }
        this.touch = true;
    }

}
