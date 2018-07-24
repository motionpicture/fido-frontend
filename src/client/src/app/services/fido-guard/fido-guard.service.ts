import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        try {
            const device = await this.native.device();
            if (device === null) {
                throw new Error('device is null');
            }
            const registerList = await this.native.fido({
                action: FidoAction.RegisterList,
                user: device.uuid
            });

            if (registerList.length === 0) {
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
