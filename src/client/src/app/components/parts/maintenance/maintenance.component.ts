import { Component, Input, OnInit } from '@angular/core';
import { IMaintenance } from '../../../services/maintenance/maintenance.service';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
    @Input() public maintenanceInfo: IMaintenance;

    constructor() { }

    public ngOnInit() {
    }

}
