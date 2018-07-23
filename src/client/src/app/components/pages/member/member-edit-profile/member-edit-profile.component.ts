import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as libphonenumber from 'libphonenumber-js';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-member-edit-profile',
    templateUrl: './member-edit-profile.component.html',
    styleUrls: ['./member-edit-profile.component.scss']
})
export class MemberEditProfileComponent implements OnInit {
    public profileForm: FormGroup;
    public isLoading: boolean;
    public disable: boolean;
    public staticProfile: {
        email: string;
    };
    constructor(
        private formBuilder: FormBuilder,
        private elementRef: ElementRef,
        private router: Router,
        private user: UserService
    ) { }

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        try {
            this.profileForm = this.createForm();
            this.isLoading = false;
            this.disable = false;
        } catch (err) {
            this.router.navigate(['/error', { redirect: '/member/edit/profile' }]);
        }
    }

    /**
     * フォーム作成
     * @method createForm
     */
    private createForm() {
        const NAME_MAX_LENGTH = 12;
        const TEL_MAX_LENGTH = 11;
        const TEL_MIN_LENGTH = 9;

        const profile = {
            familyName: {
                value: '',
                validators: [
                    Validators.required,
                    Validators.maxLength(NAME_MAX_LENGTH),
                    Validators.pattern(/^[ァ-ヶー]+$/)
                ]
            },
            givenName: {
                value: '',
                validators: [
                    Validators.required,
                    Validators.maxLength(NAME_MAX_LENGTH),
                    Validators.pattern(/^[ァ-ヶー]+$/)
                ]
            },
            telephone: {
                value: '', validators: [
                    Validators.required,
                    Validators.maxLength(TEL_MAX_LENGTH),
                    Validators.minLength(TEL_MIN_LENGTH),
                    Validators.pattern(/^[0-9]+$/),
                    (control: AbstractControl): ValidationErrors | null => {
                        const field = control.root.get('telephone');
                        if (field !== null) {
                            const parsedNumber = libphonenumber.parse(field.value, 'JP');
                            if (parsedNumber.phone === undefined) {
                                return { telephone: true };
                            }
                            const isValid = libphonenumber.isValidNumber(parsedNumber);
                            if (!isValid) {
                                return { telephone: true };
                            }
                        }

                        return null;
                    }
                ]
            },
            postalCode: {
                value: '',
                validators: []
            },
        };

        const contact = this.user.data.contact;
        if (contact === undefined) {
            throw new Error('contact is undefined');
        }
        profile.givenName.value = contact.givenName;
        profile.familyName.value = contact.familyName;
        profile.telephone.value = contact.telephone.replace(/\-/g, '');
        this.staticProfile = {
            email: contact.email
        };

        return this.formBuilder.group({
            familyName: [profile.familyName.value, profile.familyName.validators],
            givenName: [profile.givenName.value, profile.givenName.validators],
            telephone: [profile.telephone.value, profile.telephone.validators],
            postalCode: [profile.postalCode.value, profile.postalCode.validators]
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
        if (this.profileForm.invalid) {
            // フォームのステータス変更
            this.profileForm.controls.familyName.markAsTouched();
            this.profileForm.controls.givenName.markAsTouched();
            this.profileForm.controls.telephone.markAsTouched();
            this.profileForm.controls.postalCode.markAsTouched();
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
            await this.user.updateProfile({
                familyName: this.profileForm.controls.familyName.value,
                givenName: this.profileForm.controls.givenName.value,
                email: this.staticProfile.email,
                telephone: this.profileForm.controls.telephone.value,
                postalCode: this.profileForm.controls.postalCode.value,
            });
            this.router.navigate(['/member/edit']);
        } catch (err) {
            this.router.navigate(['/error', { redirect: '/member/edit/profile' }]);
        }
    }

}
