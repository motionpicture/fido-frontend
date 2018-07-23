/**
 * ErrorComponent
 */
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
    public isLoading: boolean;

    constructor() { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
    }

    /**
     * 接続
     * @method connect
     */
    public async connect() {
        this.isLoading = true;
        location.href = '/';
    }

}
