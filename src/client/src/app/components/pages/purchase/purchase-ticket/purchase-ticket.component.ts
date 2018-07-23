import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ISalesTicketResult, PurchaseService } from '../../../../services/purchase/purchase.service';
import { UserService } from '../../../../services/user/user.service';


interface Ioffer {
    price: number;
    priceCurrency: string;
    seatNumber: string;
    seatSection: string;
    selected: boolean;
    limitCount: number;
    limitUnit: string;
    validation: boolean;
    ticketInfo: {
        mvtkNum: string;
        ticketCode: string;
        ticketName: string;
        mvtkAppPrice: number;
        addGlasses: number;
        kbnEisyahousiki: string;
        mvtkKbnDenshiken: string;
        mvtkKbnMaeuriken: string;
        mvtkKbnKensyu: string;
        mvtkSalesPrice: number;
        addPrice: number,
        disPrice: number,
        salePrice: number,
        seatNum: string;
        stdPrice: number,
        ticketCount: number,
        ticketNameEng: string;
        ticketNameKana: string;
        usePoint?: number;
    };
}

interface ISalesPointTicket extends ISalesTicketResult {
    id: string;
    selected: boolean;
}

@Component({
    selector: 'app-purchase-ticket',
    templateUrl: './purchase-ticket.component.html',
    styleUrls: ['./purchase-ticket.component.scss']
})
export class PurchaseTicketComponent implements OnInit {
    public offers: Ioffer[];
    public totalPrice: number;
    public selectOffer: Ioffer;
    public ticketsModal: boolean;
    public isLoading: boolean;
    public discountConditionsModal: boolean;
    public notSelectModal: boolean;
    public salesTickets: ISalesTicketResult[];
    public salesPointTickets: ISalesPointTicket[];
    public ticketForm: FormGroup;
    public disable: boolean;

    constructor(
        public purchase: PurchaseService,
        public user: UserService,
        private formBuilder: FormBuilder,
        private router: Router
    ) { }

    public ngOnInit() {
        window.scrollTo(0, 0);
        this.purchase.load();
        this.isLoading = false;
        this.ticketsModal = false;
        this.discountConditionsModal = false;
        this.notSelectModal = false;
        this.ticketForm = this.formBuilder.group({});
        this.disable = false;
        try {
            this.salesTickets = this.createSalseTickets();
            this.salesPointTickets = this.createSalsePointTickets();
            this.setOffers();
            this.totalPrice = this.getTotalPrice();
            this.upDateSalseTickets();
        } catch (err) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 販売可能チケット生成
     * @method createSalseTickets
     */
    private createSalseTickets() {
        const results = [];
        for (const salesTicket of this.purchase.data.salesTickets) {
            const noGlassesBase = {};
            const noGlasses = Object.assign(noGlassesBase, salesTicket);
            noGlasses.addGlasses = 0;
            results.push(noGlasses);
            if (salesTicket.addGlasses > 0) {
                // メガネあり券種作成
                const glassesBase = {};
                const glasses = Object.assign(glassesBase, salesTicket);
                glasses.salePrice = glasses.salePrice + glasses.addGlasses;
                glasses.ticketName = `${glasses.ticketName}メガネ込み`;
                results.push(glasses);
            }
        }

        return results;
    }

    /**
     * ポイントチケット生成
     * @method createSalsePointTickets
     */
    private createSalsePointTickets() {
        const results = [];
        let count = 0;
        for (const pointTicket of this.purchase.data.pointTickets) {
            const salesTicket = {
                ticketCode: pointTicket.ticketCode,
                ticketName: pointTicket.ticketName,
                ticketNameKana: pointTicket.ticketNameKana,
                ticketNameEng: pointTicket.ticketNameEng,
                stdPrice: 0,
                addPrice: 0,
                salePrice: 0,
                limitCount: 1,
                limitUnit: '001',
                ticketNote: '',
                addGlasses: 0,
                selected: false,
                id: `${pointTicket.ticketCode}${count}`
            };
            const noGlassesBase = {};
            const noGlasses = Object.assign(noGlassesBase, salesTicket);
            noGlasses.addGlasses = 0;
            results.push(noGlasses);
            if (salesTicket.addGlasses > 0) {
                // メガネあり券種作成
                const glassesBase = {};
                const glasses = Object.assign(glassesBase, salesTicket);
                glasses.salePrice = glasses.salePrice + glasses.addGlasses;
                glasses.ticketName = `${glasses.ticketName}メガネ込み`;
                results.push(glasses);
            }
            count++;
        }

        return results;
    }

    /**
     * 券種リスト更新
     * @method upDateSalseTickets
     */
    public upDateSalseTickets() {
        // ポイント券種
        for (const ticket of this.salesPointTickets) {
            ticket.selected = false;
        }
        for (const offer of this.offers) {
            if (offer.ticketInfo.mvtkNum !== ''
                || offer.ticketInfo.salePrice > 0) {
                continue;
            }
            // 選択済みへ変更
            const sameTicket = this.salesPointTickets.find((ticket) => {
                return (offer.ticketInfo.ticketCode === ticket.ticketCode
                    && !ticket.selected);
            });
            if (sameTicket !== undefined) {
                sameTicket.selected = true;
            }
        }
    }

    /**
     * 次へ
     * @method onSubmit
     */
    public async onSubmit() {
        const notSelectOffers = this.offers.filter((offer) => {
            return (!offer.selected);
        });
        if (notSelectOffers.length > 0) {
            this.notSelectModal = true;

            return;
        }
        if (this.ticketValidation()) {
            window.scrollTo(0, 0);
            this.discountConditionsModal = true;

            return;
        }
        if (this.disable) {
            return;
        }
        this.disable = true;
        this.isLoading = true;
        if (this.purchase.isExpired()) {
            this.router.navigate(['expired']);

            return;
        }
        try {
            const offers = this.offers.map((offer) => {
                return {
                    seatSection: offer.seatSection,
                    seatNumber: offer.seatNumber,
                    ticketInfo: offer.ticketInfo
                };
            });
            await this.purchase.ticketRegistrationProcess(offers);
            this.router.navigate(['/purchase/input']);
        } catch (err) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * オファーを登録
     * @method setOffers
     */
    private setOffers() {
        if (this.purchase.data.seatReservationAuthorization === undefined
            && this.purchase.data.tmpSeatReservationAuthorization !== undefined) {
            this.offers = this.purchase.data.tmpSeatReservationAuthorization.object.offers.map((offer) => {
                return {
                    price: offer.price,
                    priceCurrency: offer.priceCurrency,
                    seatNumber: offer.seatNumber,
                    seatSection: offer.seatSection,
                    mvtkNum: '',
                    selected: false,
                    limitCount: 0,
                    limitUnit: '',
                    validation: false,
                    ticketInfo: offer.ticketInfo
                };
            });
        } else if (this.purchase.data.seatReservationAuthorization !== undefined) {
            this.offers = this.purchase.data.seatReservationAuthorization.object.offers.map((offer) => {
                if (offer.ticketInfo.mvtkNum === '') {
                    let ticket = this.salesTickets.find((salseTicket) => {
                        return (offer.ticketInfo.ticketCode === salseTicket.ticketCode
                            && offer.ticketInfo.addGlasses === salseTicket.addGlasses);
                    });

                    if (ticket === undefined) {
                        // ポイント券種
                        ticket = <ISalesTicketResult>{
                            limitCount: 1,
                            limitUnit: '001'
                        };
                    }

                    return {
                        price: offer.price,
                        priceCurrency: offer.priceCurrency,
                        seatNumber: offer.seatNumber,
                        seatSection: offer.seatSection,
                        mvtkNum: offer.ticketInfo.mvtkNum,
                        selected: true,
                        limitCount: ticket.limitCount,
                        limitUnit: ticket.limitUnit,
                        validation: false,
                        ticketInfo: offer.ticketInfo
                    };
                } else {
                    return {
                        price: offer.price,
                        priceCurrency: offer.priceCurrency,
                        seatNumber: offer.seatNumber,
                        seatSection: offer.seatSection,
                        mvtkNum: offer.ticketInfo.mvtkNum,
                        selected: true,
                        limitCount: 1,
                        limitUnit: '001',
                        validation: false,
                        ticketInfo: offer.ticketInfo
                    };
                }
            });
        }
    }

    /**
     * 制限単位、人数制限判定
     * @method ticketValidation
     */
    public ticketValidation(): boolean {
        let result = false;
        for (const offer of this.offers) {
            if (offer.limitUnit === '001') {
                const unitLimitTickets = this.offers.filter((targetOffer) => {
                    return (targetOffer.limitUnit === '001' && targetOffer.limitCount === offer.limitCount);
                });
                if (unitLimitTickets.length % offer.limitCount !== 0) {
                    offer.validation = true;
                    result = true;
                }
            }
        }

        return result;
    }

    /**
     * 合計金額計算
     * @method getTotalPrice
     */
    public getTotalPrice(): number {
        let result = 0;
        const selectedOffers = this.offers.filter((offer) => {
            return (offer.selected);
        });
        for (const offer of selectedOffers) {
            result += offer.ticketInfo.salePrice;
        }

        return result;
    }

    /**
     * 券種選択
     * @method ticketSelect
     * @param {Event} event
     * @param {Ioffer} offer
     */
    public ticketSelect(offer: Ioffer) {
        this.selectOffer = offer;
        this.ticketsModal = true;
    }

    /**
     * 販売可能券種選択
     * @method selectSalseTicket
     * @param {ISalesTicket} ticket
     * @param {boolean} glass
     */
    public selectSalseTicket(ticket: ISalesTicketResult) {
        const target = this.offers.find((offer) => {
            return (offer.seatNumber === this.selectOffer.seatNumber);
        });
        if (target === undefined) {
            this.ticketsModal = false;

            return;
        }
        const findTicket = this.purchase.data.pointTickets.find((pointTicket) => {
            return (pointTicket.ticketCode === ticket.ticketCode);
        });
        const usePoint = (findTicket !== undefined) ? findTicket.usePoint : 0;
        target.price = ticket.salePrice;
        target.priceCurrency = this.selectOffer.priceCurrency;
        target.seatNumber = this.selectOffer.seatNumber;
        target.seatSection = this.selectOffer.seatSection;
        target.selected = true;
        target.limitCount = ticket.limitCount;
        target.limitUnit = ticket.limitUnit;
        target.ticketInfo = {
            mvtkNum: '',
            ticketCode: ticket.ticketCode,
            ticketName: ticket.ticketName,
            mvtkAppPrice: 0,
            addGlasses: ticket.addGlasses,
            kbnEisyahousiki: '00',
            mvtkKbnDenshiken: '00',
            mvtkKbnMaeuriken: '00',
            mvtkKbnKensyu: '00',
            mvtkSalesPrice: 0,
            addPrice: ticket.addPrice,
            disPrice: 0,
            salePrice: ticket.salePrice,
            seatNum: this.selectOffer.seatNumber,
            stdPrice: ticket.stdPrice,
            ticketCount: 1,
            ticketNameEng: ticket.ticketNameEng,
            ticketNameKana: ticket.ticketNameKana,
            usePoint: usePoint
        };
        this.totalPrice = this.getTotalPrice();
        this.upDateSalseTickets();
        this.ticketsModal = false;
    }

}
