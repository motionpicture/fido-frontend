/**
 * NgModule
 */

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'angular2-moment';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { AboutComponent } from './components/pages/about/about.component';
import { AuthLogoutComponent } from './components/pages/auth/auth-logout/auth-logout.component';
import { AuthSelectComponent } from './components/pages/auth/auth-select/auth-select.component';
import { AuthSigninComponent } from './components/pages/auth/auth-signin/auth-signin.component';
import { AuthSignoutComponent } from './components/pages/auth/auth-signout/auth-signout.component';
import { BaseComponent } from './components/pages/base/base.component';
import { BenefitsComponent } from './components/pages/benefits/benefits.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { ExpiredComponent } from './components/pages/expired/expired.component';
import { LawComponent } from './components/pages/law/law.component';
import { MemberBenefitsComponent } from './components/pages/member/member-benefits/member-benefits.component';
import { MemberEditCreditComponent } from './components/pages/member/member-edit-credit/member-edit-credit.component';
import { MemberEditProfileComponent } from './components/pages/member/member-edit-profile/member-edit-profile.component';
import { MemberEditComponent } from './components/pages/member/member-edit/member-edit.component';
import { MemberMypageComponent } from './components/pages/member/member-mypage/member-mypage.component';
import { MemberPointHistoryComponent } from './components/pages/member/member-point-history/member-point-history.component';
import { MemberPointComponent } from './components/pages/member/member-point/member-point.component';
import { MemberWithdrawComponent } from './components/pages/member/member-withdraw/member-withdraw.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { PolicyComponent } from './components/pages/policy/policy.component';
import { PrivacyComponent } from './components/pages/privacy/privacy.component';
import { PurchaseBaseComponent } from './components/pages/purchase/purchase-base/purchase-base.component';
import { PurchaseCompleteComponent } from './components/pages/purchase/purchase-complete/purchase-complete.component';
import { PurchaseConfirmComponent } from './components/pages/purchase/purchase-confirm/purchase-confirm.component';
import { PurchaseInputComponent } from './components/pages/purchase/purchase-input/purchase-input.component';
import { PurchaseScheduleComponent } from './components/pages/purchase/purchase-schedule/purchase-schedule.component';
import { PurchaseSeatComponent } from './components/pages/purchase/purchase-seat/purchase-seat.component';
import { PurchaseTicketComponent } from './components/pages/purchase/purchase-ticket/purchase-ticket.component';
import { PurchaseTransactionComponent } from './components/pages/purchase/purchase-transaction/purchase-transaction.component';
import { RegisterCreditComponent } from './components/pages/register/register-credit/register-credit.component';
import { RegisterComponent } from './components/pages/register/register-index/register-index.component';
import {
    RegisterProgramMembershipComponent
} from './components/pages/register/register-program-membership/register-program-membership.component';
import { RegisterTermsComponent } from './components/pages/register/register-terms/register-terms.component';
import { TicketComponent } from './components/pages/ticket/ticket.component';
import { TutorialComponent } from './components/pages/tutorial/tutorial.component';
import { ButtonsComponent } from './components/parts/buttons/buttons.component';
import { HeaderMenuComponent } from './components/parts/header-menu/header-menu.component';
import { HeaderComponent } from './components/parts/header/header.component';
import { IconComponent } from './components/parts/icon/icon.component';
import { InformationComponent } from './components/parts/information/information.component';
import { LoadingComponent } from './components/parts/loading/loading.component';
import { MaintenanceComponent } from './components/parts/maintenance/maintenance.component';
import { MembershipBenefitsComponent } from './components/parts/membership-benefits/membership-benefits.component';
import { ModalComponent } from './components/parts/modal/modal.component';
import { NavigationComponent } from './components/parts/navigation/navigation.component';
import { PageComponent } from './components/parts/page/page.component';
import { PointHistoryListComponent } from './components/parts/point-history-list/point-history-list.component';
import { PointSliderComponent } from './components/parts/point-slider/point-slider.component';
import { PointStampsComponent } from './components/parts/point-stamps/point-stamps.component';
import { PurchasePerformanceFilmComponent } from './components/parts/purchase-performance-film/purchase-performance-film.component';
import { PurchasePerformanceTimeComponent } from './components/parts/purchase-performance-time/purchase-performance-time.component';
import { PurchaseStepComponent } from './components/parts/purchase-step/purchase-step.component';
import { ScreenComponent } from './components/parts/screen/screen.component';
import { SeatInfoComponent } from './components/parts/seat-info/seat-info.component';
import { TicketDetailComponent } from './components/parts/ticket-detail/ticket-detail.component';
import { TicketNotFoundComponent } from './components/parts/ticket-not-found/ticket-not-found.component';
import { AvailabilityPipe } from './pipes/availability/availability.pipe';
import { DateFormatPipe } from './pipes/date-format/date-format.pipe';
import { DurationPipe } from './pipes/duration/duration.pipe';
import { LibphonenumberFormatPipe } from './pipes/libphonenumber-format/libphonenumber-format.pipe';
import { TimeFormatPipe } from './pipes/time-format/time-format.pipe';

@NgModule({
    declarations: [
        AppComponent,
        TutorialComponent,
        NavigationComponent,
        HeaderComponent,
        NotFoundComponent,
        BaseComponent,
        TimeFormatPipe,
        LibphonenumberFormatPipe,
        AvailabilityPipe,
        DurationPipe,
        AboutComponent,
        LoadingComponent,
        PolicyComponent,
        LawComponent,
        PrivacyComponent,
        ErrorComponent,
        TicketDetailComponent,
        TicketNotFoundComponent,
        HeaderMenuComponent,
        TicketComponent,
        AuthSelectComponent,
        AuthLogoutComponent,
        MemberBenefitsComponent,
        MemberEditComponent,
        MemberWithdrawComponent,
        MemberPointComponent,
        MemberPointHistoryComponent,
        MemberMypageComponent,
        PurchasePerformanceTimeComponent,
        PurchasePerformanceFilmComponent,
        IconComponent,
        AuthSigninComponent,
        AuthSignoutComponent,
        MemberEditCreditComponent,
        ModalComponent,
        MemberEditProfileComponent,
        RegisterTermsComponent,
        RegisterComponent,
        MembershipBenefitsComponent,
        PointSliderComponent,
        PointStampsComponent,
        BenefitsComponent,
        DateFormatPipe,
        RegisterCreditComponent,
        RegisterProgramMembershipComponent,
        InformationComponent,
        PageComponent,
        PointHistoryListComponent,
        MaintenanceComponent,
        PurchaseScheduleComponent,
        PurchaseStepComponent,
        PurchaseBaseComponent,
        PurchaseCompleteComponent,
        PurchaseScheduleComponent,
        PurchaseSeatComponent,
        PurchaseTicketComponent,
        PurchaseInputComponent,
        PurchaseConfirmComponent,
        PurchaseTransactionComponent,
        ScreenComponent,
        SeatInfoComponent,
        ButtonsComponent,
        ExpiredComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MomentModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SwiperModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
