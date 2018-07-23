import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { IIndividualScreeningEvent, ISalesTicketResult, PurchaseService } from '../../../../services/purchase/purchase.service';
import { SasakiService } from '../../../../services/sasaki/sasaki.service';
import { MemberType, UserService } from '../../../../services/user/user.service';
import { IInputScreenData, ISeat } from '../../../parts/screen/screen.component';

@Component({
    selector: 'app-purchase-seat',
    templateUrl: './purchase-seat.component.html',
    styleUrls: ['./purchase-seat.component.scss']
})
export class PurchaseSeatComponent implements OnInit, AfterViewInit {
    public isLoading: boolean;
    public seatForm: FormGroup;
    public notSelectSeatModal: boolean;
    public upperLimitModal: boolean;
    public seats: ISeat[];
    public disable: boolean;
    public screenData: IInputScreenData;
    public environment = environment;

    constructor(
        public purchase: PurchaseService,
        private router: Router,
        private formBuilder: FormBuilder,
        private sasaki: SasakiService,
        private user: UserService
    ) { }

    public ngOnInit() {
        window.scrollTo(0, 0);
        this.isLoading = true;
        this.notSelectSeatModal = false;
        this.seats = [];
        this.seatForm = this.formBuilder.group({
            terms: [true, [Validators.requiredTrue]]
        });
        this.disable = false;
        if (this.purchase.data.individualScreeningEvent === undefined) {
            console.error('individualScreeningEvent is undefined');
            this.router.navigate(['/error']);

            return;
        }

        this.screenData = {
            theaterCode: this.purchase.data.individualScreeningEvent.coaInfo.theaterCode,
            dateJouei: this.purchase.data.individualScreeningEvent.coaInfo.dateJouei,
            titleCode: this.purchase.data.individualScreeningEvent.coaInfo.titleCode,
            titleBranchNum: this.purchase.data.individualScreeningEvent.coaInfo.titleBranchNum,
            timeBegin: this.purchase.data.individualScreeningEvent.coaInfo.timeBegin,
            screenCode: this.purchase.data.individualScreeningEvent.coaInfo.screenCode
        };

    }

    public async ngAfterViewInit() {
        if (this.purchase.data.salesTickets.length === 0) {
            this.purchase.data.salesTickets = await this.fitchSalesTickets();
        }
    }

    /**
     * スクリーン読み込み完了
     * @method loadScreen
     * @param {ISeat[]} seats
     */
    public loadScreen(seats: ISeat[]) {
        this.isLoading = false;
        this.seats = seats;
    }

    /**
     * 販売可能チケット情報取得
     * @method getSalesTickets
     */
    public async fitchSalesTickets() {
        const individualScreeningEvent = <IIndividualScreeningEvent>this.purchase.data.individualScreeningEvent;
        await this.sasaki.getServices();
        const salesTicketArgs = {
            theaterCode: individualScreeningEvent.coaInfo.theaterCode,
            dateJouei: individualScreeningEvent.coaInfo.dateJouei,
            titleCode: individualScreeningEvent.coaInfo.titleCode,
            titleBranchNum: individualScreeningEvent.coaInfo.titleBranchNum,
            timeBegin: individualScreeningEvent.coaInfo.timeBegin,
            flgMember: (this.user.isMember()) ? (<any>MemberType.Member) : (<any>MemberType.NotMember)
        };
        const salesTickets = await this.sasaki.getSalesTickets(salesTicketArgs);
        // console.log('salesTickets', salesTicketArgs, salesTickets);

        return salesTickets;
    }

    /**
     * 次へ
     * @method onSubmit
     */
    public async onSubmit() {
        if (this.seats.length === 0) {
            this.notSelectSeatModal = true;
            return;
        }
        if (this.disable) {
            return;
        }
        if (this.seatForm.invalid) {
            this.seatForm.controls.terms.markAsDirty();

            return;
        }
        this.disable = true;
        this.isLoading = true;
        if (this.purchase.isExpired()) {
            this.router.navigate(['expired']);

            return;
        }
        try {
            if (this.purchase.data.salesTickets.length === 0) {
                this.purchase.data.salesTickets = await this.fitchSalesTickets();
            }
            const offers = this.seats.map((seat) => {
                const salesTicket = (<ISalesTicketResult[]>this.purchase.data.salesTickets)[0];

                return {
                    seatSection: seat.section,
                    seatNumber: seat.code,
                    ticketInfo: {
                        ticketCode: salesTicket.ticketCode,
                        mvtkAppPrice: 0,
                        ticketCount: 1,
                        addGlasses: 0,
                        kbnEisyahousiki: '00',
                        mvtkNum: '',
                        mvtkKbnDenshiken: '00',
                        mvtkKbnMaeuriken: '00',
                        mvtkKbnKensyu: '00',
                        mvtkSalesPrice: 0
                    }
                };
            });
            await this.purchase.seatRegistrationProcess(offers);
            this.router.navigate(['/purchase/ticket']);
        } catch (err) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 座席選択
     * @method seatSelect
     * @param {Iseat[]} seats
     */
    public seatSelect(seats: ISeat[]) {
        this.seats = seats;
    }

    /**
     * 座席選択数警告
     * @method seatSelectionAlert
     */
    public seatSelectionAlert() {
        this.upperLimitModal = true;
    }

}

