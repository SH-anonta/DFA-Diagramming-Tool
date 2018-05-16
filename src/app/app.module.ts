import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {RootRouterModule} from './root-router.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RootRouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

