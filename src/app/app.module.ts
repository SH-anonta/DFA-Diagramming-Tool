import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {RootRouterModule} from './root-router.module';
import {HeaderComponent} from './page-components/header/header.component';
import {FooterComponent} from './page-components/footer/footer.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

