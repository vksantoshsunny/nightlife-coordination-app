import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
// import { AccountComponent } from './account/account.component';
// import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuard } from './auth/auth-guard.service';
import { NonAuthGuard } from './auth/non-auth-guard.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
  ] },

  // { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  // { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
