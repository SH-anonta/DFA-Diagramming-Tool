import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RootRouterModule} from './root-router.module';
import {HeaderComponent} from './page-components/header/header.component';
import {FooterComponent} from './page-components/footer/footer.component';
import {UserService} from './global-services/user.service';
import {AuthService} from './global-services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    RootRouterModule,
  ],
  providers: [
    AuthService,
    UserService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

