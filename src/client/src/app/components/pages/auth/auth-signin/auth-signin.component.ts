import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

    constructor(
        private router: Router,
        private user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        try {
            await this.user.initMember();
            this.router.navigate(['/']);
        } catch (err) {
            console.error(err);
            this.router.navigate(['/error', { redirect: '/auth/select' }]);
        }

    }

}
