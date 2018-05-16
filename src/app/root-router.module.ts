import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router';
import {HomepageComponent} from './page-components/homepage/homepage.component';
import {Error404Component} from './page-components/error404/error404.component';
import {LoginComponent} from './page-components/login/login.component';
import {RegisterComponent} from './page-components/register/register.component';


let routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'error-404', component: Error404Component},
  {path: '**', redirectTo: 'error-404'},
];

@NgModule({
  declarations: [
    HomepageComponent,
    Error404Component,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RootRouterModule {}
