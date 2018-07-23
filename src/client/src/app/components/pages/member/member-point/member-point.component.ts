import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-member-point',
    templateUrl: './member-point.component.html',
    styleUrls: ['./member-point.component.scss']
})
export class MemberPointComponent implements OnInit {
    public isLoading: boolean;
    public pointUseModal: boolean;

    constructor(
        public user: UserService,
        private router: Router
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.pointUseModal = false;
        this.isLoading = true;
        try {
            await this.user.updateAccount();
        } catch (err) {
            this.router.navigate(['/error', { redirect: '/member/point' }]);
            console.log('MemberPointComponent.ngOnInit', err);
        }
        this.isLoading = false;
    }

}
