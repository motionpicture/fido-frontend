/**
 * TicketDetailComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
import { CallNativeService, FidoAction, IDeviceResult } from '../../../services/call-native/call-native.service';
import { IReservation } from '../../../services/reservation/reservation.service';

@Component({
    selector: 'app-ticket-detail',
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
    @Input() public reservation: IReservation;
    @Input() public device: IDeviceResult;
    @Output() public update = new EventEmitter();
    @Output() public alert = new EventEmitter();
    @Output() public start = new EventEmitter();
    @Output() public end = new EventEmitter();
    public showQrCodeList: boolean[];
    public qrCodeList: string[];
    public confirmationNumber: string;
    public isAuthentication: boolean;

    constructor(
        private native: CallNativeService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.isAuthentication = false;
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

    /**
     * 認証
     */
    public async authentication() {
        this.start.emit();
        try {
            const authenticationResult = await this.native.fido({
                action: FidoAction.Authentication,
                user: `fido-frontend-${this.device.uuid}`
            });
            if (!authenticationResult.isSuccess) {
                throw Error(authenticationResult.error);
            }
            this.isAuthentication = true;
            this.update.emit();
        } catch (err) {
            this.alert.emit(err.message);
        }
        this.end.emit();
    }

}
