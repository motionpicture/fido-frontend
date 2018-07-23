/**
 * StorageService
 */
import { Injectable } from '@angular/core';
import * as moment from 'moment';

export enum SaveType {
    /**
     * セッションへ保存
     */
    Session = 0,
    /**
     * ローカルへ保存
     */
    Local = 1
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
        console.log('StorageService');
     }

    public load(key: string, saveType?: SaveType): any | null {
        const storage = (saveType === SaveType.Session) ? sessionStorage : localStorage;
        const value = storage.getItem(key);

        return (value === null) ? null : JSON.parse(value);
    }

    public save(key: string, value: any, saveType?: SaveType): void {
        value.updateAt = moment().toISOString();
        const storage = (saveType === SaveType.Session) ? sessionStorage : localStorage;
        try {
            storage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error('StorageService.save', err);
        }
    }

    public remove(key: string, saveType?: SaveType): void {
        const storage = (saveType === SaveType.Session) ? sessionStorage : localStorage;
        storage.removeItem(key);
    }

}
