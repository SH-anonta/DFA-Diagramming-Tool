import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {RootRouterModule} from './root-router.module';
import {HeaderComponent} from './page-components/header/header.component';
import {FooterComponent} from './page-components/footer/footer.component';
import {AuthService} from './global-services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RootRouterModule
  ],
  providers: [
    AuthService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

