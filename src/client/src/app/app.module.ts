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
import { BaseComponent } from './components/pages/base/base.component';
import { FidoRegisterComponent } from './components/pages/fido/fido-register/fido-register.component';
import { FidoRemoveComponent } from './components/pages/fido/fido-remove/fido-remove.component';
import { IndexComponent } from './components/pages/index/index.component';
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
        NavigationComponent,
        HeaderComponent,
        BaseComponent,
        TimeFormatPipe,
        LibphonenumberFormatPipe,
        AvailabilityPipe,
        DurationPipe,
        LoadingComponent,
        TicketDetailComponent,
        TicketNotFoundComponent,
        HeaderMenuComponent,
        PurchasePerformanceTimeComponent,
        PurchasePerformanceFilmComponent,
        IconComponent,
        ModalComponent,
        MembershipBenefitsComponent,
        PointSliderComponent,
        PointStampsComponent,
        DateFormatPipe,
        InformationComponent,
        PageComponent,
        PointHistoryListComponent,
        MaintenanceComponent,
        PurchaseStepComponent,
        ScreenComponent,
        SeatInfoComponent,
        ButtonsComponent,
        FidoRegisterComponent,
        FidoRemoveComponent,
        IndexComponent
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
