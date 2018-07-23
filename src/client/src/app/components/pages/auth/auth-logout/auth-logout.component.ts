import { Component, OnInit } from '@angular/core';
import { SasakiService } from '../../../../services/sasaki/sasaki.service';

@Component({
    selector: 'app-auth-logout',
    templateUrl: './auth-logout.component.html',
    styleUrls: ['./auth-logout.component.scss']
})
export class AuthLogoutComponent implements OnInit {
    public isLoading: boolean;

    constructor(
        private sasaki: SasakiService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        this.isLoading = false;
    }

    /**
     * サインアウト
     * @method signOut
     */
    public async signOut() {
        this.isLoading = true;
        try {
            await this.sasaki.signOut();
        } catch {
            this.isLoading = false;
        }
    }

}
