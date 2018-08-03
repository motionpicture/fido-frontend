import { Component, OnInit } from '@angular/core';
import { CallNativeService, QRScannerAction } from '../../../services/call-native/call-native.service';

@Component({
    selector: 'app-qrcode',
    templateUrl: './qrcode.component.html',
    styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {

    public isLoading: boolean;
    public alertModal: boolean;
    public errorMessage: string;
    public infoModal: boolean;
    public infoMessage: string;

    constructor(
        private native: CallNativeService
    ) { }

    public async ngOnInit() {
        this.alertModal = false;
        this.infoModal = false;
        this.isLoading = false;
    }

    public async scan() {
        try {
            const scanResult = await this.native.QRScanner({
                action: QRScannerAction.Show
            });
            if (scanResult.result !== null) {
                this.infoMessage = JSON.stringify(scanResult.result);
                this.infoModal = true;
            } else {
                this.errorMessage = scanResult.error.message;
                this.alertModal = true;
            }
        } catch (err) {
            console.error(err);
        }
    }

}
