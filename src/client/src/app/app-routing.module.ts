/**
 * ルーティング
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './components/pages/error/error.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { TutorialComponent } from './components/pages/tutorial/tutorial.component';
import * as auth from './routes/auth.route';
import * as common from './routes/common.route';
import * as member from './routes/member.route';
import * as purchase from './routes/purchase.route';
import * as register from './routes/register.route';

const appRoutes: Routes = [
    { path: '', redirectTo: '/member/mypage', pathMatch: 'full' },
    common.route,
    auth.route,
    auth.logoutRoute,
    register.route,
    member.route,
    purchase.route,
    { path: 'tutorial', component: TutorialComponent },
    { path: 'error/:redirect', component: ErrorComponent },
    { path: 'error', component: ErrorComponent },
    { path: '**', component: NotFoundComponent }
];

// tslint:disable-next-line:no-stateless-class
@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true, enableTracing: true }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
