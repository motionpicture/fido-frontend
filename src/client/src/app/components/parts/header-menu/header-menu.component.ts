/**
 * HeaderMenuComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CallNativeService, InAppBrowserTarget } from '../../../services/call-native/call-native.service';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
    @Input() public isMember: boolean;
    @Input() public isOpen: boolean;
    @Output() public close: EventEmitter<{}> = new EventEmitter();

    public environment = environment;

    constructor(
        private callNative: CallNativeService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
    }

    /**
     * webブラウザで開く
     * @method openWebBrowse
     */
    public openWebBrowse(url: string) {
        this.callNative.inAppBrowser({
            url: url,
            target: InAppBrowserTarget.System
        });
        this.close.emit();
    }
}
