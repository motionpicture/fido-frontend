import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CallNativeService, FidoAction } from '../../../../services/call-native/call-native.service';

@Component({
    selector: 'app-qrcode-confirm',
    templateUrl: './qrcode-confirm.component.html',
    styleUrls: ['./qrcode-confirm.component.scss']
})
export class QrcodeConfirmComponent implements OnInit {

    public isLoading: boolean;
    public errorMessage: string;
    public alertModal: boolean;

    constructor(
        private router: Router,
        private native: CallNativeService
    ) { }

    public ngOnInit() {
    }

    public async onSubmit() {
        this.isLoading = true;
        // デモ用
        try {
            const device = await this.native.device();
            if (device === null) {
                throw new Error('device is null');
            }
            const authenticationResult = await this.native.fido({
                action: FidoAction.Authentication,
                user: `${environment.APP_NAME}-${environment.ENV}-${device.uuid}`
            });
            if (!authenticationResult.isSuccess) {
                throw Error(authenticationResult.error);
            }
            this.router.navigate(['/qrcode/complete']);
        } catch (err) {
            this.isLoading = false;
            this.errorMessage = err.message;
            this.alertModal = true;
        }
    }

}
