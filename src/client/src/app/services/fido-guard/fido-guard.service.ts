import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CallNativeService, FidoAction } from '../call-native/call-native.service';

@Injectable({
    providedIn: 'root'
})
export class FidoGuardService implements CanActivate {

    constructor(
        private native: CallNativeService,
        private router: Router
    ) { }

    /**
     * 認証
     * @method canActivate
     */
    public async canActivate() {
        // console.log('FidoGuardService');
        try {
            const device = await this.native.device();
            if (device === null) {
                throw new Error('device is null');
            }
            const registerListResult = await this.native.fido({
                action: FidoAction.RegisterList,
                user: `${environment.APP_NAME}-${environment.ENV}-${device.uuid}`
            });

            if (!registerListResult.isSuccess) {
                throw new Error('registerList fail');
            }

            if (registerListResult.result === undefined
                || registerListResult === null
                || registerListResult.result.length === 0) {
                throw new Error('registerList not found');
            }

            return true;
        } catch (err) {
            console.log('canActivate', err);
            this.router.navigate(['/fido/register']);

            return false;
        }
    }
}
