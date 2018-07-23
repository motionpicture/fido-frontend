import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SaveType, StorageService } from '../storage/storage.service';

@Injectable({
    providedIn: 'root'
})
export class TutorialGuardService implements CanActivate {

    constructor(
        private router: Router,
        private storage: StorageService
    ) { }

    /**
       * 認証
       * @method canActivate
       */
    public canActivate() {
        const device = this.storage.load('device', SaveType.Local);
        if (device === null || !device.tutorial) {
            this.router.navigate(['/tutorial']);

            return false;
        }
        return true;
    }

}
