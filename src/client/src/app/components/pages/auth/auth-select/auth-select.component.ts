import { Component, OnInit } from '@angular/core';
import { CallNativeService } from '../../../../services/call-native/call-native.service';
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
        private user: UserService,
        private native: CallNativeService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.isLoading = false;
        try {
            const device = await this.native.device();
            alert('success');
            alert(device);
        } catch (err) {
            alert('fail');
            alert(err);
        }
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
