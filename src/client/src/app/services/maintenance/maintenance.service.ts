import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

export interface IMaintenance {
    isMaintenance: boolean;
    maintenanceText: string;
    startDate: string;
    endDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {

    constructor(
        private http: HttpClient
    ) { }

    public async isMaintenance() {
        const options = {};
        const url = '/api/maintenance/confirm';
        const maintenance = await this.http.get<IMaintenance>(url, options).toPromise();

        return maintenance;
    }

}
