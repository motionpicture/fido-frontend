import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CallNativeService, FidoAction } from '../../../../services/call-native/call-native.service';
import { PurchaseService } from '../../../../services/purchase/purchase.service';
import { UserService } from '../../../../services/user/user.service';

@Component({
    selector: 'app-purchase-confirm',
    templateUrl: './purchase-confirm.component.html',
    styleUrls: ['./purchase-confirm.component.scss']
})
export class PurchaseConfirmComponent implements OnInit {
    public confirmForm: FormGroup;
    public isLoading: boolean;
    public disable: boolean;
    public environment = environment;
    public alertModal: boolean;
    public errorMessage: string;

    constructor(
        public purchase: PurchaseService,
        public user: UserService,
        private formBuilder: FormBuilder,
        private router: Router,
        private native: CallNativeService
    ) { }

    public ngOnInit() {
        window.scrollTo(0, 0);
        this.isLoading = false;
        this.confirmForm = this.formBuilder.group({
            notes: [true, [Validators.requiredTrue]]
        });
        this.disable = false;
    }

    public async onSubmit() {
        this.isLoading = true;
        // デモ用
        try {
            const device = await this.native.device();
            if (device === null) {
                throw new Error('device is null');
            }
            const authenticationResult = await this.native.fido({
                action: FidoAction.Authentication,
                user: `fido-frontend-${device.uuid}`
            });
            if (!authenticationResult.isSuccess) {
                throw Error(authenticationResult.error);
            }
        } catch (err) {
            this.isLoading = false;
            this.errorMessage = err.message;
            this.alertModal = true;
            return;
        }
        if (this.disable) {
            return;
        }
        if (this.confirmForm.invalid) {
            this.confirmForm.controls.notes.markAsDirty();

            return;
        }
        this.disable = true;
        if (this.purchase.isExpired()) {
            this.router.navigate(['expired']);

            return;
        }
        if (this.purchase.getTotalPrice() > 0) {
            try {
                // クレジットカード処理
                await this.purchase.creditCardPaymentProcess();
            } catch (err) {
                this.purchase.data.isCreditCardError = true;
                this.router.navigate(['/purchase/input']);
                return;
            }
        }
        try {
            // if (this.user.isMember() && this.purchase.isReservePoint()) {
            //     // 会員かつポイント使用
            //     await this.purchase.pointPaymentProcess();
            // }
            // if (this.user.isMember() && this.purchase.isIncentive()) {
            //     // 会員かつポイント未使用
            //     await this.purchase.incentiveProcess();
            // }
            await this.purchase.purchaseRegistrationProcess();
            this.router.navigate(['/purchase/complete']);
        } catch (err) {
            this.router.navigate(['/error']);
        }
    }

}
