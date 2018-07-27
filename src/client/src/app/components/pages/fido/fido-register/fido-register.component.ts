import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNativeService, FidoAction, IDeviceResult } from '../../../../services/call-native/call-native.service';

@Component({
    selector: 'app-fido-register',
    templateUrl: './fido-register.component.html',
    styleUrls: ['./fido-register.component.scss']
})
export class FidoRegisterComponent implements OnInit {

    public isLoading: boolean;
    public device: IDeviceResult;
    public alertModal: boolean;
    public errorMessage: string;

    constructor(
        private native: CallNativeService,
        private router: Router
    ) { }

    public async ngOnInit() {
        this.isLoading = true;
        try {
            const device = await this.native.device();
            if (device === null) {
                throw new Error('device is null');
            }
            this.device = device;
            const registerListResult = await this.native.fido({
                action: FidoAction.RegisterList,
                user: `${this.device.uuid}`
            });
            if (!registerListResult.isSuccess) {
                throw new Error('registerList fail');
            }
            if (registerListResult.result.length > 0) {
                this.router.navigate(['/']);

                return;
            }
            this.isLoading = false;
        } catch (err) {
            this.router.navigate(['/error']);
        }
    }

    public async register() {
        this.isLoading = true;
        try {
            const registerResult = await this.native.fido({
                action: FidoAction.Register,
                user: `${this.device.uuid}`
            });
            if (!registerResult.isSuccess) {
                throw Error(registerResult.error);
            }
            this.router.navigate(['/']);
        } catch (err) {
            this.isLoading = false;
            this.errorMessage = err.message;
            this.alertModal = true;
        }
    }

}
