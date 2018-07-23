/**
 * TicketDetailComponent
 */
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
import { IReservation } from '../../../services/reservation/reservation.service';

@Component({
    selector: 'app-ticket-detail',
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
    @Input() public reservation: IReservation;
    public showQrCodeList: boolean[];
    public qrCodeList: string[];
    public confirmationNumber: string;

    constructor() { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.showQrCodeList = [];
        this.qrCodeList = [];
        this.confirmationNumber = this.reservation.confirmationNumber.split('-')[0];

        for (let i = 0; i < this.reservation.reservedTickets.length; i++) {
            // QR生成
            const showQrCode = moment(this.reservation.reservationsFor[i].startDate).subtract(24, 'hours').unix() <= moment().unix();
            this.showQrCodeList.push(showQrCode);
            if (showQrCode) {
                const ticketToken = this.reservation.reservedTickets[i].ticketToken;
                const basicSize = 21;
                const option: qrcode.QRCodeToDataURLOptions = {
                    margin: 0,
                    scale: (80 / basicSize)
                };
                const qrCode = await qrcode.toDataURL(ticketToken, option);
                this.qrCodeList.push(qrCode);
            }
        }
    }

}
