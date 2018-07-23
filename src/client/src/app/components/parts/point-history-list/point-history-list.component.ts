import { Component, Input, OnInit } from '@angular/core';
import { factory } from '@motionpicture/sskts-api-javascript-client';
import * as moment from 'moment';

@Component({
    selector: 'app-point-history-list',
    templateUrl: './point-history-list.component.html',
    styleUrls: ['./point-history-list.component.scss']
})
export class PointHistoryListComponent implements OnInit {
    @Input() public action: factory.pecorino.action.transfer.moneyTransfer.IAction;
    @Input() public accountNumber: string;
    public circle: string;
    public description: string;
    public amount: string;
    public date: string;

    constructor() { }

    public ngOnInit() {
        const transactionType = factory.pecorino.transactionType;
        this.date = moment(this.action.endDate).format('YYYY年MM月DD日');
        this.description = (this.action.description !== undefined)
            ? this.action.description.replace(/\,/g, '<br>')
            : '';
        if (this.action.purpose.typeOf === transactionType.Deposit
            && this.action.amount < 0) {
            this.circle = 'blue';
            this.amount = String(this.action.amount);
        } else if (this.action.purpose.typeOf === transactionType.Deposit
            && this.action.amount > 0) {
            this.amount = `+${this.action.amount}`;
        } else if (this.action.purpose.typeOf === transactionType.Transfer
            && (<any>this.action.fromLocation).accountNumber === this.accountNumber) {
            this.circle = 'blue';
            this.amount = String(this.action.amount * -1);
        } else if (this.action.purpose.typeOf === transactionType.Transfer
            && (<any>this.action.fromLocation).accountNumber !== this.accountNumber) {
            this.circle = 'blue';
            this.amount = String(this.action.amount);
        }
    }

}
