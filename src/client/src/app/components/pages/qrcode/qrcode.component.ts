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
        this.isLoading = true;
        try {
            const prepareResult = await this.native.QRScanner({
                action: QRScannerAction.Prepare
            });
            if (prepareResult.err) {
                throw prepareResult.err;
            }
            await this.native.QRScanner({
                action: QRScannerAction.Show
            });
            const scanResult = await this.native.QRScanner({
                action: QRScannerAction.Scan
            });
            await this.native.QRScanner({
                action: QRScannerAction.Hide
            });
            await this.native.QRScanner({
                action: QRScannerAction.Destroy
            });
            if (scanResult.err) {
                this.infoMessage = scanResult.contents;
                this.infoModal = true;
            } else {
                throw scanResult.err;
            }
        } catch (err) {
            this.errorMessage = err.message;
            this.alertModal = true;
        }
        this.isLoading = false;
    }

}
