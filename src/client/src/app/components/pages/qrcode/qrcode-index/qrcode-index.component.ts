import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNativeService, QRScannerAction } from '../../../../services/call-native/call-native.service';

@Component({
    selector: 'app-qrcode-index',
    templateUrl: './qrcode-index.component.html',
    styleUrls: ['./qrcode-index.component.scss']
})
export class QrcodeIndexComponent implements OnInit {

    public isLoading: boolean;
    public alertModal: boolean;
    public errorMessage: string;
    public infoModal: boolean;
    public infoMessage: string;

    constructor(
        private native: CallNativeService,
        private router: Router
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
                if (scanResult.result.cancelled === 1
                    || scanResult.result.text === undefined
                    || scanResult.result.text === '') {
                    return;
                }
                // this.infoMessage = scanResult.result.text;
                // this.infoModal = true;
                this.router.navigate(['/qrcode/confirm']);
            } else {
                this.errorMessage = scanResult.error.message;
                this.alertModal = true;
            }
        } catch (err) {
            console.error(err);
        }
    }

}
