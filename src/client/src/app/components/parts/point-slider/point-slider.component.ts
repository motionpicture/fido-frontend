import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-point-slider',
    templateUrl: './point-slider.component.html',
    styleUrls: ['./point-slider.component.scss']
})
export class PointSliderComponent implements OnInit {

    @Input() public point: number;
    public viewPoint: number;

    constructor() { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        this.viewPoint = (this.point > 5) ? 6 : this.point;
    }

}
