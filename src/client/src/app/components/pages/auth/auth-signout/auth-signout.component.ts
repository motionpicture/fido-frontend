import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberType, UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-auth-signout',
    templateUrl: './auth-signout.component.html',
    styleUrls: ['./auth-signout.component.scss']
})
export class AuthSignoutComponent implements OnInit {

    constructor(
        private router: Router,
        private user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        this.user.data.memberType = MemberType.NotMember;
        this.user.reset();
        this.router.navigate(['/auth/select']);
    }

}
