import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as COA from '@motionpicture/coa-service';
import 'rxjs/add/operator/toPromise';
import { PurchaseService } from '../../../services/purchase/purchase.service';
import { SasakiService } from '../../../services/sasaki/sasaki.service';

@Component({
    selector: 'app-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit, AfterViewInit {
    public static ZOOM_SCALE = 1;
    @Input() public inputData: IInputScreenData;
    @Input() public test: boolean;
    @Output() public select = new EventEmitter<ISeat[]>();
    @Output() public alert = new EventEmitter();
    @Output() public load = new EventEmitter<ISeat[]>();
    public data: IData;
    public zoomState: boolean;
    public scale: number;
    public height: number;
    public origin: string;

    constructor(
        private elementRef: ElementRef,
        private http: HttpClient,
        private purchase: PurchaseService,
        private sasaki: SasakiService,
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.zoomState = false;
        this.scale = 1;
        this.height = 0;
        this.origin = '0 0';
        try {
            const data = await this.getData();
            this.data = this.createScreen(data);
        } catch (err) {
            console.log(err);
            this.router.navigate(['/error']);
        }
    }

    /**
     * レンダリング後処理
     */
    public ngAfterViewInit() {
        const time = 300;
        const timer = setInterval(() => {
            if (this.data !== undefined) {
                clearInterval(timer);
                const screenElement = document.querySelector('.screen-style');
                if (screenElement !== null && this.data.screen.style !== undefined) {
                    screenElement.innerHTML = this.data.screen.style;
                }
                this.scaleDown();
                this.load.emit(this.getSelectSeats());
            }
        }, time);
    }

    /**
     * モバイル判定
     * @method isMobile
     * @returns {boolean}
     */
    public isMobile(): boolean {
        if (window.innerWidth > 768) {
            return false;
        }

        return true;
    }

    /**
     * 選択座席取得
     * @method getSelectSeats
     * @returns {Iseat[]}
     */
    public getSelectSeats(): ISeat[] {
        return this.data.seats.filter((seat) => {
            return (seat.status === 'active');
        });
    }

    /**
     * 座席選択
     * @method seatSelect
     * @param {Event} event
     * @param {Iseat} seat
     */
    public seatSelect(seat: ISeat) {
        if (this.isMobile() && !this.zoomState) {
            return;
        }
        if (seat.status === 'default') {
            seat.status = 'active';
        } else if (seat.status === 'active') {
            seat.status = 'default';
        }
        const individualScreeningEvent = this.purchase.data.individualScreeningEvent;
        if (individualScreeningEvent !== undefined
            && individualScreeningEvent.coaInfo.availableNum < this.getSelectSeats().length) {
            seat.status = 'default';
            this.alert.emit();

            return;
        }
        this.select.emit(this.getSelectSeats());
    }

    /**
     * 拡大
     * @method scaleUp
     * @param {Event} event
     * @returns {void}
     */
    public scaleUp(event: MouseEvent) {
        if (this.zoomState) {
            return;
        }
        if (!this.isMobile()) {
            return;
        }
        this.zoomState = true;
        const element: HTMLElement = this.elementRef.nativeElement;
        const screen = <HTMLDivElement>element.querySelector('.screen');
        const scroll = <HTMLDivElement>element.querySelector('.screen-scroll');
        const rect = scroll.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const offset = {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft
        };
        const pos = {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
        const scrollPos = {
            x: pos.x / this.scale - screen.offsetWidth / 2,
            y: pos.y / this.scale - screen.offsetHeight / 2,
        };
        this.scale = ScreenComponent.ZOOM_SCALE;
        this.origin = '50% 50%';

        setTimeout(() => {
            scroll.scrollLeft = scrollPos.x;
            scroll.scrollTop = scrollPos.y;
        }, 0);
    }

    /**
     * 縮小
     * @method scaleDown
     * @returns {void}
     */
    public scaleDown(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        const screen = <HTMLDivElement>element.querySelector('.screen');
        this.zoomState = false;
        const scale = screen.offsetWidth / this.data.screen.size.w;
        this.scale = (scale > ScreenComponent.ZOOM_SCALE) ? ScreenComponent.ZOOM_SCALE : scale;
        this.height = this.data.screen.size.h * this.scale;
        this.origin = '0 0';
    }

    /**
     * リサイズ処理
     * @method resize
     */
    public resize(): void {
        this.scaleDown();
    }

    /**
     * データ取得
     * @method getData
     */
    public async getData(): Promise<{
        screen: IScreen,
        status: COA.services.reserve.IStateReserveSeatResult
    }> {
        const DIGITS = {
            '02': -2,
            '03': -3
        };
        const theaterCode = `00${this.inputData.theaterCode}`.slice(DIGITS['02']);
        const screenCode = `000${this.inputData.screenCode}`.slice(DIGITS['03']);
        const screen = await this.http.get<IScreen>(`/assets/json/theater/${theaterCode}/${screenCode}.json`).toPromise();
        const setting = await this.http.get<IScreen>('/assets/json/theater/setting.json').toPromise();

        await this.sasaki.getServices();
        let seatStatus;
        if (this.test) {
            seatStatus = (<any>{ listSeat: [] });
        } else {
            seatStatus = await this.sasaki.getSeatState({
                theaterCode: this.inputData.theaterCode,
                dateJouei: this.inputData.dateJouei,
                titleCode: this.inputData.titleCode,
                titleBranchNum: this.inputData.titleBranchNum,
                timeBegin: this.inputData.timeBegin,
                screenCode: this.inputData.screenCode
            });
        }
        // スクリーンデータをマージ
        return {
            screen: Object.assign(setting, screen),
            status: seatStatus
        };
    }

    /**
     * スクリーン作成
     */
    public createScreen(data: {
        screen: IScreen,
        status: COA.services.reserve.IStateReserveSeatResult
    }): IData {
        // console.log(data.screen);
        const screenData = data.screen;
        const seatStatus = data.status;
        // y軸ラベル
        const labels: string[] = [];
        const startLabelNo = 65;
        const endLabelNo = 91;
        for (let i = startLabelNo; i < endLabelNo; i++) {
            labels.push(String.fromCharCode(i));
        }
        // 行ラベル
        const lineLabels: ILabel[] = [];
        // 列ラベル
        const columnLabels: ILabel[] = [];
        // 座席リスト
        const seats: ISeat[] = [];

        const toFullWidth = (value: string) => {
            return value.replace(/./g, (s: string) => {
                return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
            });
        };
        const pos = { x: 0, y: 0 };
        let labelCount = 0;
        for (let y = 0; y < screenData.map.length; y++) {
            if (y === 0) {
                pos.y = 0;
            }
            // ポジション設定
            if (y === 0) {
                pos.y += screenData.seatStart.y;
            } else if (screenData.map[y].length === 0) {
                pos.y += screenData.aisle.middle.h - screenData.seatMargin.h;
            } else {
                labelCount++;
                pos.y += screenData.seatSize.h + screenData.seatMargin.h;
            }

            for (let x = 0; x < screenData.map[y].length; x++) {
                if (x === 0) {
                    pos.x = screenData.seatStart.x;
                }

                // 座席ラベルHTML生成
                if (x === 0) {
                    lineLabels.push({
                        id: labelCount,
                        w: screenData.seatSize.w,
                        h: screenData.seatSize.h,
                        y: pos.y,
                        x: pos.x - screenData.seatLabelPos,
                        label: labels[labelCount]
                    });
                }

                if (screenData.map[y][x] === 8) {
                    pos.x += screenData.aisle.middle.w;
                } else if (screenData.map[y][x] === 9) {
                    pos.x += screenData.aisle.middle.w;
                } else if (screenData.map[y][x] === 10) {
                    pos.x += (screenData.seatSize.w / 2) + screenData.seatMargin.w;
                } else if (screenData.map[y][x] === 11) {
                    pos.x += (screenData.seatSize.w / 2) + screenData.seatMargin.w;
                }

                // 座席番号HTML生成
                if (y === 0) {

                    const label = (data.screen.seatNumberAlign === 'left')
                        ? String(x + 1)
                        : String(screenData.map[0].length - x);
                    columnLabels.push({
                        id: x,
                        w: screenData.seatSize.w,
                        h: screenData.seatSize.h,
                        y: pos.y - screenData.seatNumberPos,
                        x: pos.x,
                        label: label
                    });

                }
                if (screenData.map[y][x] === 1
                    || screenData.map[y][x] === 4
                    || screenData.map[y][x] === 5
                    || screenData.map[y][x] === 8
                    || screenData.map[y][x] === 10) {
                    // 座席HTML生成
                    const code = (data.screen.seatNumberAlign === 'left')
                        ? `${toFullWidth(labels[labelCount])}－${toFullWidth(String(x + 1))}`
                        : `${toFullWidth(labels[labelCount])}－${toFullWidth(String(screenData.map[y].length - x))}`;
                    const label = (data.screen.seatNumberAlign === 'left')
                        ? `${labels[labelCount]}${String(x + 1)}`
                        : `${labels[labelCount]}${String(screenData.map[y].length - x)}`;
                    let section = '';
                    let status = 'disabled';
                    for (const listSeat of seatStatus.listSeat) {
                        const targetSeat = listSeat.listFreeSeat.find((freeSeat) => {
                            return (freeSeat.seatNum === code);
                        });
                        if (targetSeat !== undefined) {
                            section = listSeat.seatSection;
                            status = 'default';
                            break;
                        }
                    }
                    // 選択中
                    if (this.purchase.data.tmpSeatReservationAuthorization !== undefined) {
                        const targetOffer = this.purchase.data.tmpSeatReservationAuthorization.object.offers.find((offer) => {
                            return (offer.seatNumber === code);
                        });
                        if (targetOffer !== undefined) {
                            section = targetOffer.seatSection;
                            status = 'active';
                        }
                    }

                    const seat = {
                        className: `seat-${label}`,
                        w: screenData.seatSize.w,
                        h: screenData.seatSize.h,
                        y: pos.y,
                        x: pos.x,
                        label: label,
                        code: code,
                        section: section,
                        status: status
                    };
                    if (screenData.hc.indexOf(label) !== -1) {
                        seat.className = `seat-${label} seat-hc`;
                    }
                    seats.push(seat);
                }
                // ポジション設定
                if (screenData.map[y][x] === 2) {
                    pos.x += screenData.aisle.middle.w + screenData.seatMargin.w;
                } else if (screenData.map[y][x] === 3) {
                    pos.x += screenData.aisle.small.w + screenData.seatMargin.w;
                } else if (screenData.map[y][x] === 4) {
                    pos.x += screenData.aisle.middle.w + screenData.seatSize.w + screenData.seatMargin.w;
                } else if (screenData.map[y][x] === 5) {
                    pos.x += screenData.aisle.small.w + screenData.seatSize.w + screenData.seatMargin.w;
                } else if (screenData.map[y][x] === 6) {
                    pos.x += screenData.aisle.middle.w + screenData.seatSize.w + screenData.seatMargin.w;
                } else if (screenData.map[y][x] === 7) {
                    pos.x += screenData.aisle.small.w + screenData.seatSize.w + screenData.seatMargin.w;
                } else {
                    pos.x += screenData.seatSize.w + screenData.seatMargin.w;
                }
            }
        }
        // スクリーンタイプ
        const screenType = (screenData.type === 1)
            ? 'screen-imax' : (screenData.type === 2)
                ? 'screen-4dx' : '';

        return {
            screen: screenData,
            objects: screenData.objects,
            screenType: screenType,
            lineLabels: (data.screen.lineLabel) ? lineLabels : [],
            columnLabels: (data.screen.columnLabel) ? columnLabels : [],
            seats: seats
        };
    }
}

interface ISize {
    w: number;
    h: number;
}

interface IPosition {
    x: number;
    y: number;
}

interface IObject extends ISize, IPosition {
    image: string;
}

interface IScreen {
    type: number;
    size: ISize;
    objects: IObject[];
    seatStart: IPosition;
    map: number[][];
    special: string[];
    hc: string[];
    pair: string[];
    seatSize: ISize;
    seatMargin: ISize;
    aisle: {
        small: ISize;
        middle: ISize;
    };
    seatLabelPos: number;
    seatNumberPos: number;
    seatNumberAlign: 'left' | 'right';
    html: string;
    style?: string;
    columnLabel: boolean;
    lineLabel: boolean;
}

interface ILabel {
    id: number;
    w: number;
    h: number;
    y: number;
    x: number;
    label: string;
}

export interface ISeat {
    className: string;
    w: number;
    h: number;
    y: number;
    x: number;
    label: string;
    code: string;
    section: string;
    status: string;
}

interface IData {
    screen: IScreen;
    objects: IObject[];
    screenType: string;
    lineLabels: ILabel[];
    columnLabels: ILabel[];
    seats: ISeat[];
}

export interface IInputScreenData {
    theaterCode: string;
    dateJouei: string;
    titleCode: string;
    titleBranchNum: string;
    timeBegin: string;
    screenCode: string;
}
