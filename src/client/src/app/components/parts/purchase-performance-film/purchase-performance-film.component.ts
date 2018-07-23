/**
 * PurchasePerformanceFilmComponent
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { IIndividualScreeningEvent } from '../../../services/schedule/schedule.service';

@Component({
    selector: 'app-purchase-performance-film',
    templateUrl: './purchase-performance-film.component.html',
    styleUrls: ['./purchase-performance-film.component.scss']
})
export class PurchasePerformanceFilmComponent implements OnInit {
    @Input() public performance: IIndividualScreeningEvent;
    @Output() public select: EventEmitter<{}> = new EventEmitter();
    public salseFlg: boolean;

    constructor() { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        this.salseFlg = moment(this.performance.startDate).unix() > moment().add(30, 'minutes').unix();
    }

}

