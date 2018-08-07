import { BaseComponent } from '../components/pages/base/base.component';
import { QrcodeCompleteComponent } from '../components/pages/qrcode/qrcode-complete/qrcode-complete.component';
import { QrcodeConfirmComponent } from '../components/pages/qrcode/qrcode-confirm/qrcode-confirm.component';
import { QrcodeIndexComponent } from '../components/pages/qrcode/qrcode-index/qrcode-index.component';
import { TicketComponent } from '../components/pages/ticket/ticket.component';
import { AuthGuardService } from '../services/auth-guard/auth-guard.service';
import { FidoGuardService } from '../services/fido-guard/fido-guard.service';

/**
 * 共通ルーティング
 */
export const route = {
    path: '',
    component: BaseComponent,
    canActivate: [FidoGuardService, AuthGuardService],
    children: [
        { path: 'ticket', component: TicketComponent },
        { path: 'qrcode', component: QrcodeIndexComponent },
        { path: 'qrcode/confirm', component: QrcodeConfirmComponent },
        { path: 'qrcode/complete', component: QrcodeCompleteComponent }
    ]
};

