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
    public isScan: boolean;

    constructor(
        private native: CallNativeService
    ) { }

    public async ngOnInit() {
        this.alertModal = false;
        this.infoModal = false;
        this.isLoading = false;
        this.isScan = false;
    }

    public async prepare() {
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
        } catch (err) {
            this.errorMessage = err.message;
            this.alertModal = true;
        }
    }

    public async scan() {
        this.isScan = true;
        try {
            const scanResult = await this.native.QRScanner({
                action: QRScannerAction.Scan
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
        await this.destroy();
    }

    public async destroy() {
        await this.native.QRScanner({
            action: QRScannerAction.Destroy
        });
        this.isScan = false;
    }

}
