import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
    @Input() public touch?: boolean;
    constructor() { }

    public ngOnInit() {
        if (this.touch === undefined) {
            this.touch = true;
        }
    }

}
