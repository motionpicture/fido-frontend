import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() { }

    public async sleep(time: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    /**
     * カタカナをひらがなへ変換
     * @param {string} str
     */
    public convertToHira(str: string) {
        return str.replace(/[\u30a1-\u30f6]/g, function (match) {
            const chr = match.charCodeAt(0) - 0x60;

            return String.fromCharCode(chr);
        });
    }

    /**
     * 位置情報取得
     */
    public async getGeolocation(options: PositionOptions) {
        return new Promise<Position>((resolve, reject) => {
            if (navigator.geolocation === undefined) {
                reject(new Error('navigator.geolocation is undefined'));
            }
            const done = (position: Position) => {
                resolve(position);
            };
            const fail = (error: PositionError) => {
                reject(error);
            };
            navigator.geolocation.getCurrentPosition(done, fail, options);
        });
    }

    /**
     * n位切り捨て
     */
    public floor(value: number, n: number) {
        return Math.floor(value * Math.pow(10, n)) / Math.pow(10, n);
    }

}
