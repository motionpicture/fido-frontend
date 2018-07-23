/**
 * TicketComponent
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperComponent, SwiperConfigInterface, SwiperDirective, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
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

    constructor(
        private router: Router,
        private reservation: ReservationService,
        public user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.touch = true;
        this.isLoading = true;
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

}
