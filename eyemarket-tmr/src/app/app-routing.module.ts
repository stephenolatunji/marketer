import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OutletsComponent } from './tmr/outlets/outlets.component';
import { OutletComponent } from './tmr/outlet/outlet.component';
import { TmrHomeComponent } from './tmr/tmr-home/tmr-home.component';
import { AuthGuardService as AuthGuard } from './service/auth-guard.service';
import { MapComponent } from './tmr/map/map.component';
import { HomeComponent } from './bdr/home/home.component';
import { MyRouteComponent } from './bdr/my-route/my-route.component';
import { DailyScheduleComponent } from './bdr/daily-schedule/daily-schedule.component';
import { PocComponent } from './bdr/poc/poc.component';
import { CameraComponent } from './camera/camera.component';
import { OpportuntyComponent } from "./opportunty/opportunty.component";

import { TmrAuthService as TMRLOCK } from './service/tmr-auth.service';
import {
  BdrLockService as BDRLOCK,
  BdrLockService
} from './service/bdr-lock.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SurveyComponent } from './survey/survey.component';
import { GeneralHomeComponent } from './general-home/general-home.component';
import { DashboardComponent } from './bdr/dashboard/dashboard.component';
import { SummaryComponent } from './bdr/summary/summary.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'TMR',
    component: TmrHomeComponent,
    canActivate: [AuthGuard, TMRLOCK]
  },
  {
    path: 'outlets',
    component: OutletsComponent,
    canActivate: [AuthGuard, TMRLOCK]
  },
  {
    path: 'outlet/:id',
    component: OutletComponent,
    canActivate: [AuthGuard, TMRLOCK]
  },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard, TMRLOCK] },

  { path: 'BDR', component: HomeComponent, canActivate: [AuthGuard, BDRLOCK] },
  {
    path: 'MyRoute',
    component: MyRouteComponent,
    canActivate: [AuthGuard, BDRLOCK]
  },
  {
    path: 'DailySchedule',
    component: DailyScheduleComponent,
    canActivate: [AuthGuard, BDRLOCK]
  },
  {
    path: 'poc/:pocId',
    component: PocComponent,
    canActivate: [AuthGuard, BDRLOCK]
  },

  {
    path: 'opportunity',
    component: OpportuntyComponent,
    canActivate: [AuthGuard]
  },

  { 
    path: 'camera', 
    component: CameraComponent, 
    canActivate: [AuthGuard] 
  },

  { 
    path: 'survey', 
    component: SurveyComponent, 
    canActivate: [AuthGuard] 
  },

  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard, BDRLOCK] 
  },

  { 
    path: 'summary/:val1/:val2', 
    component: SummaryComponent, 
    canActivate: [AuthGuard, BDRLOCK] 
  },

  { 
    path: 'admin', 
    component: AdminComponent, 
    // canActivate: [AuthGuard, BDRLOCK] 
  }

  // { 
  //   path: 'admin-login', 
  //   component: AdminLoginComponent, 
  //   // canActivate: [AuthGuard, BDRLOCK] 
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
