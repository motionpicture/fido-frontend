import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {

    constructor(
        public user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
    }

}
