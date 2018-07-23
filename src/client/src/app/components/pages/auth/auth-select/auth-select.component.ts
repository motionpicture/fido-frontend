import { Component, OnInit } from '@angular/core';
import { SasakiService } from '../../../../services/sasaki/sasaki.service';
import { MemberType, UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-auth-select',
    templateUrl: './auth-select.component.html',
    styleUrls: ['./auth-select.component.scss']
})
export class AuthSelectComponent implements OnInit {

    public isLoading: boolean;

    constructor(
        private sasaki: SasakiService,
        private user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        this.isLoading = false;
    }

    /**
     * サインイン
     * @method signIn
     */
    public async signIn() {
        this.isLoading = true;
        try {
            await this.sasaki.signIn();
            this.user.data.memberType = MemberType.Member;
            this.user.save();
        } catch (error) {
            console.error(error);
            this.isLoading = false;
        }
    }

}
