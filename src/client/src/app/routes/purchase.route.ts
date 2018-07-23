
import { BaseComponent } from '../components/pages/base/base.component';
import { PurchaseBaseComponent } from '../components/pages/purchase/purchase-base/purchase-base.component';
import { PurchaseCompleteComponent } from '../components/pages/purchase/purchase-complete/purchase-complete.component';
import { PurchaseConfirmComponent } from '../components/pages/purchase/purchase-confirm/purchase-confirm.component';
import { PurchaseInputComponent } from '../components/pages/purchase/purchase-input/purchase-input.component';
import { PurchaseScheduleComponent } from '../components/pages/purchase/purchase-schedule/purchase-schedule.component';
import { PurchaseSeatComponent } from '../components/pages/purchase/purchase-seat/purchase-seat.component';
import { PurchaseTicketComponent } from '../components/pages/purchase/purchase-ticket/purchase-ticket.component';
import { PurchaseTransactionComponent } from '../components/pages/purchase/purchase-transaction/purchase-transaction.component';
import { AuthGuardService } from '../services/auth-guard/auth-guard.service';
import { PurchaseGuardService } from '../services/purchase-guard/purchase-guard.service';

export const route = {
    path: 'purchase',
    canActivate: [AuthGuardService],
    children: [
        { path: '', redirectTo: '/purchase/schedule', pathMatch: 'full' },
        {
            path: '',
            component: BaseComponent,
            children: [
                { path: 'schedule', component: PurchaseScheduleComponent }
            ]
        },
        { path: 'transaction', component: PurchaseTransactionComponent },
        {
            path: '',
            component: PurchaseBaseComponent,
            canActivate: [PurchaseGuardService],
            children: [
                { path: 'seat', component: PurchaseSeatComponent },
                { path: 'ticket', component: PurchaseTicketComponent },
                { path: 'input', component: PurchaseInputComponent },
                { path: 'confirm', component: PurchaseConfirmComponent }
            ]
        },
        {
            path: '',
            component: PurchaseBaseComponent,
            children: [
                { path: 'complete', component: PurchaseCompleteComponent }
            ]
        }
    ]
};
