import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNativeService, FidoAction, IDeviceResult } from '../../../../services/call-native/call-native.service';

@Component({
    selector: 'app-fido-remove',
    templateUrl: './fido-remove.component.html',
    styleUrls: ['./fido-remove.component.scss']
})
export class FidoRemoveComponent implements OnInit {

    public isLoading: boolean;
    public device: IDeviceResult;
    public alertModal: boolean;
    public errorMessage: string;
    public registerList: any[];

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
                user: `fido-frontend-${device.uuid}`
            });
            if (!registerListResult.isSuccess) {
                throw new Error('registerList fail');
            }
            if (registerListResult.result.length === 0) {
                this.router.navigate(['/fido/register']);

                return;
            }
            this.registerList = registerListResult.result;
            this.isLoading = false;
        } catch (err) {
            this.router.navigate(['/error']);
        }
    }

    public async remove() {
        this.isLoading = true;
        try {
            const authenticationResult = await this.native.fido({
                action: FidoAction.Authentication,
                user: `fido-frontend-${this.device.uuid}`
            });
            if (!authenticationResult.isSuccess) {
                throw Error(authenticationResult.error);
            }
            const removeResult = await this.native.fido({
                action: FidoAction.Remove,
                user: `fido-frontend-${this.device.uuid}`,
                handle: this.registerList[0].handle
            });
            if (!removeResult.isSuccess) {
                throw Error(removeResult.error);
            }
            this.router.navigate(['/fido/register']);
        } catch (err) {
            this.isLoading = false;
            this.errorMessage = err.message;
            this.alertModal = true;
        }
    }

}
