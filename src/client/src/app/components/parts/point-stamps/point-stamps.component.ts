import { Component, Input, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
    selector: 'app-point-stamps',
    templateUrl: './point-stamps.component.html',
    styleUrls: ['./point-stamps.component.scss']
})
export class PointStampsComponent implements OnInit {
    @Input() public point: number;
    public config: SwiperConfigInterface;
    public stamps: {
        label: number;
        status: boolean;
    }[][];
    constructor() { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        const pagination: SwiperPaginationInterface = {
            el: '.swiper-pagination',
            type: 'fraction',
            clickable: true
        };
        this.config = {
            pagination: pagination,
            autoHeight: true
        };

        const stampGroupLimit = 6;
        // グループリスト作成
        this.stamps = [];
        const loop = (this.point === 0) ? 1 : Math.ceil(this.point / stampGroupLimit);
        for (let i = 0; i < loop; i++) {
            // グループ作成
            const stampGroup = [];
            for (let j = 0; j < stampGroupLimit; j++) {
                stampGroup.push({
                    label: (j % 6) + 1,
                    status: false
                });
            }
            this.stamps.push(stampGroup);
        }
        // ステータス反映
        this.stamps.forEach((group, groupIndex) => {
            group.forEach((stamp, index) => {
                stamp.status = (groupIndex * stampGroupLimit) + index < this.point;
            });
        });

    }

}
