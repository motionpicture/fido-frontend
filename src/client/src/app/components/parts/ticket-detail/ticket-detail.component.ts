/**
 * TicketDetailComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import * as qrcode from 'qrcode';
import { CallNativeService, FidoAction, IDeviceResult } from '../../../services/call-native/call-native.service';
import { IReservation } from '../../../services/reservation/reservation.service';
import { UtilService } from '../../../services/util/util.service';

@Component({
    selector: 'app-ticket-detail',
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
    @Input() public reservation: IReservation;
    @Input() public device: IDeviceResult;
    @Output() public alert = new EventEmitter();
    @Output() public authStart = new EventEmitter();
    @Output() public authEnd = new EventEmitter<string | undefined>();
    public showQrCodeList: boolean[];
    public qrCodeList: string[];
    public confirmationNumber: string;
    public isAuthentication: boolean;

    constructor(
        private native: CallNativeService,
        private util: UtilService
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
        this.authStart.emit();
        try {
            const authenticationResult = await this.native.fido({
                action: FidoAction.Authentication,
                user: `fido-frontend-${this.device.uuid}`
            });
            if (!authenticationResult.isSuccess) {
                throw Error(authenticationResult.error);
            }
            let message;
            try {
                const geolocation = await this.native.geolocation({
                    enableHighAccuracy: false,
                    timeout: 10000
                });
                // 情報表示
                // alert(JSON.stringify(geolocation));
                const reservationsFor = this.reservation.reservationsFor[0];
                if (geolocation.coords !== undefined) {
                    const latitude = 35.674019;
                    const longitude = 139.738420;
                    const diff = 0.001000;
                    const isLatitude = (latitude - diff < geolocation.coords.latitude
                        && geolocation.coords.latitude < latitude + diff);
                    const isLongitude = (longitude - diff < geolocation.coords.longitude
                        && geolocation.coords.longitude < longitude + diff);
                    message = `緯度: <strong>${isLatitude}</strong><br>
                    ${this.util.floor(latitude - diff, 6)} <<br>
                    <strong>${this.util.floor(geolocation.coords.latitude, 6)}</strong><br>
                    < ${this.util.floor(latitude + diff, 6)}<br>
                    経度: <strong>${isLongitude}</strong><br>
                    ${this.util.floor(longitude - diff, 6)} < <br>
                    <strong>${this.util.floor(geolocation.coords.longitude, 6)}</strong><br>
                    < ${this.util.floor(longitude + diff, 6)}<br>`;
                }
                const isDate = (moment(reservationsFor.startDate).subtract(1, 'days').unix() < moment().unix()
                    && moment().unix() < moment(reservationsFor.endDate).unix());
                message = `時間: <strong>${isDate}</strong><br>
                ${moment(reservationsFor.startDate).subtract(1, 'days').format('YYYY/MM/DD HH:mm')} <<br>
                 <strong>${moment().format('YYYY/MM/DD HH:mm')}</strong> <br>
                 < ${moment(reservationsFor.endDate).format('YYYY/MM/DD HH:mm')}`;
            } catch (err) {
                message = err.message;
            }

            this.isAuthentication = true;
            this.authEnd.emit(message);
        } catch (err) {
            this.alert.emit(err.message);
            this.authEnd.emit(undefined);
        }
    }

}
