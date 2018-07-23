import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class MemberGuardService implements CanActivate {

    constructor(
        private router: Router,
        private user: UserService
    ) { }

    /**
     * 認証
     * @method canActivate
     */
    public async canActivate() {
        if (!this.user.isMember()) {
            this.router.navigate(['/auth/select']);

            return false;
        }

        return true;
    }

}
