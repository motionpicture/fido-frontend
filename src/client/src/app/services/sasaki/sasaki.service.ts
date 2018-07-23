import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as COA from '@motionpicture/coa-service';
import * as sasaki from '@motionpicture/sskts-api-javascript-client';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
    providedIn: 'root'
})
export class SasakiService {

    public auth: sasaki.IImplicitGrantClient;
    public userName?: string;
    public event: sasaki.service.Event;
    public order: sasaki.service.Order;
    public organization: sasaki.service.Organization;
    public person: sasaki.service.Person;
    public place: sasaki.service.Place;
    public transaction: {
        placeOrder: sasaki.service.transaction.PlaceOrder
    };
    public programMembership: sasaki.service.ProgramMembership;

    constructor(
        private http: HttpClient,
        private storage: StorageService
    ) { }

    /**
     * getServices
     */
    public async getServices(): Promise<void> {
        try {
            const option = await this.createOption();
            this.event = new sasaki.service.Event(option);
            this.order = new sasaki.service.Order(option);
            this.organization = new sasaki.service.Organization(option);
            this.person = new sasaki.service.Person(option);
            this.place = new sasaki.service.Place(option);
            this.transaction = {
                placeOrder: new sasaki.service.transaction.PlaceOrder(option)
            };
            this.programMembership = new sasaki.service.ProgramMembership(option);
        } catch (err) {
            console.log(err);

            throw new Error('getServices is failed');
        }
    }

    /**
     * サインイン
     */
    public async signIn() {
        const url = '/api/authorize/signIn';
        const result = await this.http.get<any>(url, {}).toPromise();
        console.log(result.url);
        location.href = result.url;
    }

    /**
     * サインアップ
     */
    public async signUp() {
        const url = '/api/authorize/signIn';
        const result = await this.http.get<any>(url, {}).toPromise();
        console.log(result.url);
        const signupUrl = (<string>result.url).replace(/\/authorize/, '/signup');
        location.href = signupUrl;
    }

    /**
     * サインアウト
     */
    public async signOut() {
        const url = '/api/authorize/signOut';
        const result = await this.http.get<any>(url, {}).toPromise();
        console.log(result.url);
        location.href = result.url;
    }

    /**
     * @method createOption
     */
    public async createOption() {
        await this.authorize();

        return {
            endpoint: environment.API_ENDPOINT,
            auth: this.auth
        };
    }

    /**
     * @method authorize
     */
    public async authorize() {
        const user = this.storage.load('user');
        const memberType = user.memberType;
        const url = '/api/authorize/getCredentials';
        const options = {
            headers: new HttpHeaders({
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'If-Modified-Since': new Date(0).toUTCString()
            }),
            params: new HttpParams().set('member', memberType)
        };
        const result = await this.http.get<{
            credentials: {
                accessToken: string;
            };
            userName?: string;
        }>(url, options).toPromise();
        const option = {
            domain: '',
            clientId: '',
            redirectUri: '',
            logoutUri: '',
            responseType: '',
            scope: '',
            state: '',
            nonce: null,
            tokenIssuer: ''
        };
        this.auth = sasaki.createAuthInstance(option);
        this.auth.setCredentials(result.credentials);
        this.userName = result.userName;
    }

    /**
     * 座席ステータス取得
     * @param {COA.services.reserve.IStateReserveSeatArgs} args
     */
    public async getSeatState(
        args: COA.services.reserve.IStateReserveSeatArgs
    ) {
        const url = '/api/purchase/getSeatState';

        return this.http.get<COA.services.reserve.IStateReserveSeatResult>(url, {
            params: <any>args
        }).toPromise();
    }

    /**
     * 券種取得
     * @method getSalesTickets
     * @param {COA.services.reserve.ISalesTicketArgs} args
     */
    public async getSalesTickets(
        args: COA.services.reserve.ISalesTicketArgs
    ) {
        const url = `/api/master/getSalesTickets`;
        return this.http.get<COA.services.reserve.ISalesTicketResult[]>(url, {
            params: <any>args
        }).toPromise();
    }

    /**
     * 券種マスター一覧取得
     * @method getTickets
     * @param {COA.services.reserve.ITicketArgs} args
     */
    public async getTickets(
        args: COA.services.master.ITicketArgs
    ) {
        const url = `/api/master/getTickets`;
        return this.http.get<COA.services.master.ITicketResult[]>(url, {
            params: <any>args
        }).toPromise();
    }

    /**
     * パスポートトークン取得
     */
    public async getPassportToken(theaterId: string) {
        const url = `${environment.WAITER_ENDPOINT}/passports`;
        return this.http.post<{ token: string }>(url, {
            scope: `placeOrderTransaction.MovieTheater-${theaterId}`
        }).toPromise();
    }
}
