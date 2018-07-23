import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-member-edit-credit',
    templateUrl: './member-edit-credit.component.html',
    styleUrls: ['./member-edit-credit.component.scss']
})
export class MemberEditCreditComponent implements OnInit {

    public cardExpiration: {
        year: string[];
        month: string[];
    };
    public paymentForm: FormGroup;
    public isLoading: boolean;
    public securityCodeModal: boolean;
    public creditCardAlertModal: boolean;
    public disable: boolean;

    constructor(
        private router: Router,
        private elementRef: ElementRef,
        private formBuilder: FormBuilder,
        private user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public ngOnInit() {
        this.isLoading = false;
        this.cardExpiration = {
            year: [],
            month: []
        };
        this.paymentForm = this.createForm();
        this.disable = false;
    }

    /**
     * フォーム作成
     * @method createForm
     */
    private createForm() {
        const creditrCard = {
            cardNumber: { value: '', validators: [Validators.required, Validators.pattern(/^[0-9]+$/)] },
            cardExpirationMonth: { value: '01', validators: [Validators.required] },
            cardExpirationYear: { value: moment().format('YYYY'), validators: [Validators.required] },
            securityCode: { value: '', validators: [Validators.required] },
            holderName: { value: '', validators: [Validators.required] }
        };

        for (let i = 0; i < 12; i++) {
            const DIGITS = -2;
            this.cardExpiration.month.push(`0${String(i + 1)}`.slice(DIGITS));
        }
        for (let i = 0; i < 10; i++) {
            this.cardExpiration.year.push(moment().add(i, 'year').format('YYYY'));
        }

        return this.formBuilder.group({
            cardNumber: [creditrCard.cardNumber.value, creditrCard.cardNumber.validators],
            cardExpirationMonth: [creditrCard.cardExpirationMonth.value, creditrCard.cardExpirationMonth.validators],
            cardExpirationYear: [creditrCard.cardExpirationYear.value, creditrCard.cardExpirationYear.validators],
            securityCode: [creditrCard.securityCode.value, creditrCard.securityCode.validators],
            holderName: [creditrCard.holderName.value, creditrCard.holderName.validators]
        });
    }

    /**
     * フォーム確定
     * @method onSubmit
     */
    public async onSubmit() {
        if (this.disable) {
            return;
        }
        if (this.paymentForm.invalid) {
            // フォームのステータス変更
            this.paymentForm.controls.cardNumber.markAsTouched();
            this.paymentForm.controls.cardExpirationMonth.markAsTouched();
            this.paymentForm.controls.cardExpirationYear.markAsTouched();
            this.paymentForm.controls.securityCode.markAsTouched();
            this.paymentForm.controls.holderName.markAsTouched();
            setTimeout(() => {
                const element: HTMLElement = this.elementRef.nativeElement;
                const validation = <HTMLElement>element.querySelector('.validation');
                if (validation === null) {
                    return;
                }
                const rect = validation.getBoundingClientRect();
                const contents = (<HTMLElement>element.querySelector('app-page .scroll'));
                const scrollTop = contents.scrollTop;
                const top = rect.top + scrollTop - 80;
                contents.scrollTo(0, top);
            }, 0);

            return;
        }
        this.disable = true;
        this.isLoading = true;

        try {
            // GMOトークン取得
            const gmoTokenObject = await this.user.getGmoObject({
                cardno: this.paymentForm.controls.cardNumber.value,
                expire: this.paymentForm.controls.cardExpirationYear.value + this.paymentForm.controls.cardExpirationMonth.value,
                securitycode: this.paymentForm.controls.securityCode.value,
                holdername: this.paymentForm.controls.holderName.value
            });

            // 会員 クレジットカード情報保存
            await this.user.registerCreditCard(gmoTokenObject);
            this.router.navigate(['/member/edit']);
        } catch (err) {
            console.error(err);
            // クレジットカード処理失敗
            this.isLoading = false;
            this.creditCardAlertModal = true;
            this.paymentForm.controls.cardNumber.setValue('');
            this.paymentForm.controls.securityCode.setValue('');
            this.paymentForm.controls.holderName.setValue('');
            this.disable = false;
        }
    }

}
