/**
 * BaseComponent
 */
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

    constructor(
        public user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
    }

}
