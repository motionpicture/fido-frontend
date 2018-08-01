/**
 * CallNativeService
 */
import { Injectable } from '@angular/core';


/**
 * 呼び出し先
 */
const TARGET_VIEW = 'mainView';

/**
 * URLの読み込み先として使用するブラウザーの種別。
 */
export enum InAppBrowserTarget {
    /**
     * ホワイトリストに対象の URL が登録されている場合には、Cordova WebView を開きます。それ以外の場合には、InAppBrowser を開きます。
     */
    Self = '_self',
    /**
     * InAppBrowser を開きます。
     */
    Blank = '_blank',
    /**
     * システム標準の Web ブラウザー ( system’s web browser ) を開きます。
     */
    System = '_system'
}

/**
 * IinAppBrowserArgs
 */
export interface IinAppBrowserArgs {
    /**
     * URL
     */
    url: string;
    /**
     * URLの読み込み先として使用するブラウザーの種別（デフォルトはシステム標準の Web ブラウザー）
     */
    target?: InAppBrowserTarget;
}

/**
 * localNotificationArgs
 */
export interface IlocalNotificationArgs {
    /**
     * ID
     */
    id: number;
    /**
     * タイトル
     */
    title: string;
    /**
     * テキスト
     */
    text: string;
    /**
     * 通知トリガー
     */
    trigger?: {
        /**
         * 通知を送る時間（ISO）
         */
        at: string
    };
    /**
     * アイコンの画像パス
     */
    icon?: string;
    /**
     * スモールアイコンの画像パス
     */
    smallIcon?: string;
    /**
     * 前面表示（デフォルトは前面表示しない）
     */
    foreground?: boolean;
}

export enum FidoAction {
    /**
     * 登録
     */
    Register = 'register',
    /**
     * 認証
     */
    Authentication = 'authentication',
    /**
     * 取り消し
     */
    Remove = 'remove',
    /**
     * 登録リスト
     */
    RegisterList = 'registerList'
}

export interface IFidoArgs {
    action: FidoAction;
    user: string;
    handle?: string;
}

export enum QRScannerAction {
    /**
     * 準備
     */
    Prepare = 'prepare',
    /**
     * スキャン
     */
    Scan = 'scan',
    /**
     * 表示
     */
    Show = 'show',
    /**
     * 非表示
     */
    Hide = 'hide',
    /**
     * 破棄
     */
    Destroy = 'destroy'
}

export interface IQRScannerArgs {
    action: QRScannerAction;
}

export interface IDeviceResult {
    cordova: string;
    model: string;
    platform: string;
    uuid: string;
    version: string;
    isVirtual: string;
    serial: string;
}

@Injectable({
    providedIn: 'root'
})
export class CallNativeService {
    private reserveData: string | null;

    constructor() {
        this.reserveData = null;
        window.addEventListener('message', (res) => {
            if (res.origin === location.origin) {
                return;
            }
            try {
                this.reserveData = JSON.parse(res.data);
            } catch (err) {
                console.error(err);
            }
        });
    }

    /**
     * 送信
     * @method postMessage
     * @param data {any}
     */
    private postMessage(data: any) {
        const json: string = JSON.stringify(data);
        (<any>window).wizViewMessenger.postMessage(json, TARGET_VIEW);
    }

    /**
     * 受信
     * @method reserveMessage
     */
    private reserveMessage() {
        return new Promise<any>((resolve) => {
            const time = 500;
            const timer = setInterval(() => {
                const data = this.reserveData;
                if (data !== null) {
                    resolve(data);
                    this.reserveData = null;
                    clearInterval(timer);
                }
            }, time);
        });
    }

    /**
     * FIDO呼び出し
     * @method fido
     * @param args {IFidoArgs}
     */
    public async fido(args: IFidoArgs) {
        const data = {
            method: 'fido',
            option: args
        };
        let result;
        if (!this.isBrowser()) {
            this.postMessage(data);
            result = await this.reserveMessage();
        } else {
            result = {
                isSuccess: true,
                result: ['test']
            };
        }

        return result;
    }

    /**
     * device呼び出し
     * @method device
     */
    public async device(): Promise<IDeviceResult | null> {
        const data = { method: 'device' };
        let result;
        if (!this.isBrowser()) {
            this.postMessage(data);
            result = await this.reserveMessage();
            return result;
        } else {
            const browser = 'browser';
            return {
                cordova: browser,
                model: browser,
                platform: browser,
                uuid: browser,
                version: browser,
                isVirtual: browser,
                serial: browser,
            };
        }
    }

    /**
     * 位置情報取得
     * @method getGeolocation
     */
    public async geolocation(options?: PositionOptions): Promise<Position> {
        const data = {
            method: 'geolocation',
            option: options
        };
        let result;
        if (!this.isBrowser()) {
            this.postMessage(data);
            result = await this.reserveMessage();
            return result;
        } else {
            const browser = 0;
            return <any>{
                coords: {
                    latitude: browser,
                    longitude: browser
                }
            };
        }
    }

    /**
     * inAppBrowser呼び出し
     * @method postMessage
     * @param args {IinAppBrowserArgs}
     */
    public inAppBrowser(args: IinAppBrowserArgs) {
        const data = {
            method: 'inAppBrowser',
            option: args
        };
        if (!this.isBrowser()) {
            this.postMessage(data);
        }
    }

    /**
     * localNotification呼び出し
     * @method localNotification
     * @param args {IlocalNotificationArgs}
     */
    public localNotification(args: IlocalNotificationArgs) {
        const data = {
            method: 'localNotification',
            option: args
        };
        if (!this.isBrowser()) {
            this.postMessage(data);
        }
    }

    /**
     * QRリーダー呼び出し
     * @method QRScanner
     * @param args
     */
    public async QRScanner(args: IQRScannerArgs) {
        const data = {
            method: 'QRScanner',
            option: args
        };
        let result;
        if (!this.isBrowser()) {
            this.postMessage(data);
            result = await this.reserveMessage();
        } else {
            const browser = 'browser';
            if (args.action === QRScannerAction.Prepare) {
                return { err: null, status: browser };
            } else if (args.action === QRScannerAction.Scan) {
                return { err: null, contents: browser };
            } else if (args.action === QRScannerAction.Show) {
                return { status: browser };
            } else if (args.action === QRScannerAction.Hide) {
                return { status: browser };
            } else if (args.action === QRScannerAction.Destroy) {
                return { status: browser };
            }
        }

        return result;
    }

    /**
     * ブラウザ判定
     */
    private isBrowser() {
        return (<any>window).wizViewMessenger === undefined;
    }
}
