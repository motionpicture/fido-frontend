/**
 * TutorialComponent
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperConfigInterface , SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { SaveType, StorageService } from '../../../services/storage/storage.service';

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
    public config: SwiperConfigInterface;
    public step: number;

    constructor(
        private storage: StorageService,
        private router: Router
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        this.step = 0;
        const pagination: SwiperPaginationInterface = {
            el: '.swiper-pagination',
            clickable: true
        };
        this.config = {
            pagination: pagination,
            spaceBetween: 30
            // onSlideChangeEnd: (swiper) => {
            //     this.step = swiper.activeIndex;
            // }
        };
    }

    /**
     * スライド後イベント
     */
    public indexChange(index: number) {
        this.step = index;
    }

    /**
     * はじめる
     * @method start
     */
    public start() {
        const device = {
            tutorial: true
        };
        this.storage.save('device', device, SaveType.Local);
        this.router.navigate(['/auth/select']);
    }
}
