import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OutletsComponent } from './tmr/outlets/outlets.component';
import { OutletComponent } from './tmr/outlet/outlet.component';
import { MapComponent } from './tmr/map/map.component';
import { TmrHomeComponent } from './tmr/tmr-home/tmr-home.component';

import { SideNavComponent } from './bdr/side-nav/side-nav.component';
import { HomeComponent } from './bdr/home/home.component';
import { DashboardComponent } from './bdr/dashboard/dashboard.component';
import { MyRouteComponent } from './bdr/my-route/my-route.component';
import { DailyScheduleComponent } from './bdr/daily-schedule/daily-schedule.component';
import { PocComponent } from './bdr/poc/poc.component';
import { AmOnlineComponent } from './bdr/am-online/am-online.component';


import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetupPasswordComponent } from "./setup-password/setup-password.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CameraComponent } from './camera/camera.component';
import { OpportuntyComponent } from './opportunty/opportunty.component';
import { SurveyComponent } from './survey/survey.component';
import { from } from 'rxjs';
import { GeneralHomeComponent } from './general-home/general-home.component';
import { SummaryComponent } from './bdr/summary/summary.component';
import { SearchComponent } from './bdr/search/search.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    OutletsComponent,
    OutletComponent,
    SideNavComponent,
    TmrHomeComponent,
    MapComponent,
    

    SideNavComponent,
    DashboardComponent,
    MyRouteComponent,
    DailyScheduleComponent,
    PocComponent,
    AmOnlineComponent,
    HomeComponent,
    
    CameraComponent,
    NavBarComponent,
    ResetPasswordComponent,
    OpportuntyComponent,
    SurveyComponent,
    SetupPasswordComponent,
    GeneralHomeComponent,
    SummaryComponent,
    SearchComponent,
    AdminComponent,
    AdminLoginComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
