import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { IIndividualScreeningEvent } from '../../../services/schedule/schedule.service';

@Component({
    selector: 'app-purchase-performance-time',
    templateUrl: './purchase-performance-time.component.html',
    styleUrls: ['./purchase-performance-time.component.scss']
})
export class PurchasePerformanceTimeComponent implements OnInit {
    @Input() public performance: IIndividualScreeningEvent;
    @Output() public select: EventEmitter<{}> = new EventEmitter();
    public salseFlg: boolean;

    constructor() { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        const addMinutes = 30;
        const startDate = moment(this.performance.startDate).unix();
        const addDate = moment().add(addMinutes, 'minutes').unix();
        this.salseFlg = (startDate > addDate);
    }

}
