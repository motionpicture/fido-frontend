/**
 * PurchaseService
 */
import { Injectable } from '@angular/core';
import { factory } from '@motionpicture/sskts-api-javascript-client';
import * as moment from 'moment';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';
import { SasakiService } from '../sasaki/sasaki.service';
import { PurchaseSort } from '../select/select.service';
import { StorageService } from '../storage/storage.service';

export type IMovieTheater = factory.organization.movieTheater.IOrganizationWithoutGMOInfo;
export type IIndividualScreeningEvent = factory.event.individualScreeningEvent.IEventWithOffer;
export type ITimeOrder = IIndividualScreeningEvent[];
export interface IFilmOrder {
    id: string;
    films: IIndividualScreeningEvent[];
}
export interface IScheduleData {
    schedule: ISchedule[];
    expired: number;
}
export interface ISchedule {
    theater: IMovieTheater;
    schedule: {
        date: string;
        individualScreeningEvents: IIndividualScreeningEvent[];
    }[];
}
export interface IDate {
    value: string;
    display: {
        year: string;
        month: string;
        week: string;
        day: string;
        text: string;
    };
    preSale: boolean;
    serviceDay: string;
}

const STORAGE_KEY = 'schedule';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    public data?: IScheduleData;

    constructor(
        private storage: StorageService,
        private sasaki: SasakiService
    ) { }

    /**
     * スケジュール取得
     * @method getSchedule
     * @returns {Promise<IScheduleData>}
     */
    public async getSchedule(): Promise<IScheduleData> {
        const schedule: IScheduleData = (this.data === undefined)
            ? this.storage.load(STORAGE_KEY)
            : this.data;
        if (schedule === undefined || schedule === null || schedule.expired < moment().unix()) {
            try {
                this.data = await this.fitchSchedule({
                    startFrom: moment().toDate(),
                    startThrough: moment().add(5, 'week').toDate()
                });
                this.storage.save(STORAGE_KEY, this.data);
                // console.log(this.data);
            } catch (err) {
                console.log(err);
                this.storage.remove(STORAGE_KEY);
                throw err;
            }
        } else {
            this.data = schedule;
        }

        return this.data;
    }

    /**
     * スケジュールをAPI経由で取得
     * @method fitchISchedule
     * @returns {Promise<IScheduleData>}
     */
    private async fitchSchedule(
        args: { startFrom: Date; startThrough: Date; }
    ): Promise<IScheduleData> {
        await this.sasaki.getServices();

        const theaters = await this.sasaki.organization.searchMovieTheaters();
        const screeningEvents = await this.sasaki.event.searchIndividualScreeningEvent({
            startFrom: args.startFrom,
            startThrough: args.startThrough,
            eventStatuses: [factory.eventStatusType.EventScheduled]
        });

        const expired = 10;
        const schedule: ISchedule[] = [];
        theaters.forEach((theater) => {
            const theaterSchedule: {
                date: string;
                individualScreeningEvents: IIndividualScreeningEvent[];
            }[] = [];
            const theaterScreeningEvents = screeningEvents.filter((screeningEvent) => {
                return (screeningEvent.superEvent.location.branchCode === theater.location.branchCode);
            });
            const diff = moment(args.startThrough).diff(moment(args.startFrom), 'days');
            for (let i = 0; i < diff; i += 1) {
                const date = moment(args.startFrom).add(i, 'days').format('YYYYMMDD');
                const tmpDateScreeningEvents = theaterScreeningEvents.filter((screeningEvent) => {
                    return (screeningEvent.coaInfo.dateJouei === date);
                });
                const dateScreeningEvents: IIndividualScreeningEvent[] = [];
                tmpDateScreeningEvents.forEach((screeningEvent) => {
                    const PRE_SALE = '1'; // 先行販売
                    const startDate = moment(screeningEvent.startDate).format('YYYYMMDD');
                    const limitDate = moment().add(3, 'days').format('YYYYMMDD');
                    if ((this.isSalse(screeningEvent) && startDate < limitDate)
                        || (this.isSalse(screeningEvent) && screeningEvent.coaInfo.flgEarlyBooking === PRE_SALE)) {
                        dateScreeningEvents.push(screeningEvent);
                    }
                });
                theaterSchedule.push({
                    date: date,
                    individualScreeningEvents: dateScreeningEvents
                });
            }
            schedule.push({
                theater: theater,
                schedule: theaterSchedule
            });
        });

        return {
            schedule: schedule,
            expired: moment().add(expired, 'minutes').unix()
        };
    }

    /**
     * リセット
     */
    public reset() {
        this.storage.remove(STORAGE_KEY);
        this.data = undefined;
    }

    /**
     * 劇場取得
     * @method getTheater
     * @returns {<IMovieTheater[]}
     */
    public getTheater(): IMovieTheater[] {
        if (this.data === undefined) {
            throw new Error('getTheater: schedule is undefined');
        }

        return this.data.schedule.map((schedule) => {
            return schedule.theater;
        });
    }

    /**
     * 日付取得
     * @method getDate
     * @returns {IDate[]}
     */
    public getDate(theaterCode: string): IDate[] {
        if (this.data === undefined) {
            throw new Error('getDate: schedule is undefined');
        }

        const theaterSchedule = this.data.schedule.find((schedule) => {
            return (schedule.theater.location.branchCode === theaterCode);
        });

        if (theaterSchedule === undefined) {
            throw new Error('theaterSchedule is undefined');
        }

        const minDisplayDay = 2;
        const dateList = theaterSchedule.schedule.filter((schedule) => {
            const screeningEvents = schedule.individualScreeningEvents.filter((screeningEvent) => {
                return (this.isSalse(screeningEvent));
            });

            // return (screeningEvents.length > 0);
            return (moment(schedule.date).unix() < moment().add(minDisplayDay, 'days').unix()
                || screeningEvents.length > 0);
        });

        let count = 0;
        const PRE_SALE = '1'; // 先行販売

        return dateList.map((schedule) => {
            const formatDate = moment(schedule.date).format('YYYY/MM/DD');
            const preSaleList = schedule.individualScreeningEvents.filter((individualScreeningEvent) => {
                return (individualScreeningEvent.coaInfo.flgEarlyBooking === PRE_SALE);
            });
            const result = {
                value: schedule.date,
                display: {
                    month: moment(schedule.date).format('MM'),
                    week: moment(schedule.date).format('ddd'),
                    day: moment(schedule.date).format('DD'),
                    year: moment(schedule.date).format('YYYY'),
                    text: (count === 0) ? `本日 (${formatDate})`
                        : (count === 1) ? `明日 (${formatDate})`
                            : (count === 2) ? `明後日 (${formatDate})` : formatDate
                },
                preSale: (schedule.individualScreeningEvents.length > 0
                    && preSaleList.length > 0
                    && moment().add(2, 'day').unix() < moment(schedule.date).unix()),
                serviceDay: (schedule.individualScreeningEvents.length > 0)
                    ? schedule.individualScreeningEvents[0].coaInfo.nameServiceDay
                    : ''
            };
            count += 1;

            return result;
        });
    }

    /**
     * 作品別上映スケジュール取得
     * @function getScreeningEvents
     * @returns {IFilmOrder[]}
     */
    public getScreeningEvents(args: IGetScreeningEventsArgs): IGetScreeningEventsResult {
        if (this.data === undefined) {
            throw new Error('getScreeningEvents: schedule is undefined');
        }
        const result: IGetScreeningEventsResult = {
            film: [],
            time: []
        };
        const theaterSchedule = this.data.schedule.find((schedule) => {
            return (schedule.theater.location.branchCode === args.theater);
        });
        if (theaterSchedule === undefined) {
            throw new Error('theaterSchedule is undefined');
        }
        const dateSchedule = theaterSchedule.schedule.find((schedule) => {
            return (schedule.date === args.date);
        });
        if (dateSchedule === undefined) {
            throw new Error('dateSchedule is undefined');
        }
        const screeningEvents = dateSchedule.individualScreeningEvents.filter((screeningEvent) => {
            // 販売可能判定 & 販売可能時間判定
            return (this.isSalse(screeningEvent) && this.isSalseTime(screeningEvent));
        });
        // 時間順
        result.time = screeningEvents;
        // 作品順
        screeningEvents.forEach((screeningEvent) => {
            const film = result.film.find((event) => {
                return (event.id === (screeningEvent.coaInfo.titleCode + screeningEvent.coaInfo.titleBranchNum));
            });
            if (film === undefined) {
                result.film.push({
                    id: (screeningEvent.coaInfo.titleCode + screeningEvent.coaInfo.titleBranchNum),
                    films: [screeningEvent]
                });
            } else {
                film.films.push(screeningEvent);
            }
        });

        return result;
    }

    /**
     * 販売可能時間判定
     * @param {IIndividualScreeningEvent} screeningEvent
     * @returns {boolean}
     */
    private isSalseTime(screeningEvent: IIndividualScreeningEvent): boolean {
        const END_TIME = 30; // 30分前

        return (moment().unix() < moment(screeningEvent.startDate).subtract(END_TIME, 'minutes').unix());
    }

    /**
     * 販売可能判定
     * @param {IIndividualScreeningEvent} screeningEvent
     * @returns {boolean}
     */
    private isSalse(screeningEvent: IIndividualScreeningEvent): boolean {
        const PRE_SALE = '1'; // 先行販売

        return (screeningEvent.coaInfo.rsvStartDate <= moment().format('YYYYMMDD')
            || screeningEvent.coaInfo.flgEarlyBooking === PRE_SALE);
    }

}

interface IGetScreeningEventsArgs {
    theater: string;
    date: string;
    sort: PurchaseSort;
}

interface IGetScreeningEventsResult {
    film: IFilmOrder[];
    time: ITimeOrder;
}
