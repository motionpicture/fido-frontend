import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

    public transform(date: string | Date, format: string): string {
        return moment(date).format(format);
    }

}
