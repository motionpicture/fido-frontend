import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-ticket-not-found',
    templateUrl: './ticket-not-found.component.html',
    styleUrls: ['./ticket-not-found.component.scss']
})
export class TicketNotFoundComponent implements OnInit {
    @Input() public isMember: boolean;
    constructor() { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
    }

}
