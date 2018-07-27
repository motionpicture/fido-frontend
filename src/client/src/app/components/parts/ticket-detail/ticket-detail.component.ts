/**
 * TicketDetailComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
    @Output() public update = new EventEmitter();
    public showQrCodeList: boolean[];
    public qrCodeList: string[];
    public confirmationNumber: string;
    public isAuthentication: boolean;
    public isLoading: boolean;
    public device: IDeviceResult;
    public alertModal: boolean;
    public errorMessage: string;

    constructor(
        private native: CallNativeService,
        private router: Router
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
        try {
            const device = await this.native.device();
            if (device === null) {
                throw new Error('device is null');
            }
            this.device = device;
        } catch (err) {
            this.router.navigate(['/error']);
        }
    }

    /**
     * 認証
     */
    public async authentication() {
        this.isLoading = true;
        try {
            const authenticationResult = await this.native.fido({
                action: FidoAction.Authentication,
                user: `${this.device.uuid}`
            });
            if (!authenticationResult.isSuccess) {
                throw Error(authenticationResult.error);
            }
            this.isAuthentication = true;
            this.update.emit();
        } catch (err) {
            this.errorMessage = err.message;
            this.alertModal = true;
        }
        this.isLoading = false;
    }

}
