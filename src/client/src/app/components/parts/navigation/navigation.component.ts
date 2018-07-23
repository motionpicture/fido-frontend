/**
 * NavigationComponent
 */
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
/**
 * ナビゲーション
 * @class NavigationComponent
 * @implements OnInit
 */
export class NavigationComponent implements OnInit {

    constructor(
        public user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() { }

}
