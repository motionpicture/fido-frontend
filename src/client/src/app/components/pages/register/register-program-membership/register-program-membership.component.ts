import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@motionpicture/sskts-api-javascript-client';
import { MemberService } from '../../../../services/member/member.service';
import { SasakiService } from '../../../../services/sasaki/sasaki.service';

@Component({
    selector: 'app-register-program-membership',
    templateUrl: './register-program-membership.component.html',
    styleUrls: ['./register-program-membership.component.scss']
})
export class RegisterProgramMembershipComponent implements OnInit {
    public programMemberships: factory.programMembership.IProgramMembership[];
    public isLoading: boolean;
    public alertModal: boolean;
    public disable: boolean;
    public optionsForm: FormGroup;
    public theaters: factory.organization.movieTheater.IPublicFields[];

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private sasaki: SasakiService,
        private member: MemberService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.disable = false;
        this.alertModal = false;
        this.isLoading = true;
        this.optionsForm = this.createForm();
        try {
            await this.sasaki.getServices();
            // 劇場一覧取得
            this.theaters = await this.sasaki.organization.searchMovieTheaters();
            // 会員プログラム取得
            this.programMemberships = await this.member.getProgramMemberships();

            if (this.programMemberships.length === 0) {
                throw new Error('programMemberships is not found');
            }
        } catch (err) {
            console.log(err);
            this.router.navigate(['/error', { redirect: '//register/credit' }]);
        }
        this.isLoading = false;
    }

    /**
     * フォーム作成
     * @method createForm
     */
    private createForm() {
        return this.formBuilder.group({
            theater: ['', [Validators.required]]
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
        if (this.optionsForm.invalid) {
            // フォームのステータス変更
            this.optionsForm.controls.theater.markAsTouched();

            return;
        }
        this.disable = true;
        this.isLoading = true;
        try {
            // 販売劇場検索
            const theaterCode = this.optionsForm.controls.theater.value;
            const programMembership = this.programMemberships[0];
            // 会員登録
            await this.member.register({
                theaterCode: theaterCode,
                programMembership: programMembership
            });

            // 会員登録確認
            const isRegister = await this.member.isRegister();
            if (!isRegister) {
                this.router.navigate(['/error', { redirect: '/auth/select' }]);

                return;
            }

            this.router.navigate(['/']);
        } catch (err) {
            console.error(err);
            // 会員プログラム登録失敗
            this.isLoading = false;
            this.disable = false;
            this.alertModal = true;
        }
    }

}
