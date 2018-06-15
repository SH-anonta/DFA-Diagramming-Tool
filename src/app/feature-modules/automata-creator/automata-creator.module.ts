import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DfaCreatorComponent} from './dfa-creator/dfa-creator.component';
import { ControlsComponent } from './dfa-creator/controls/controls.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DfaCreatorComponent,
    ControlsComponent
  ],
  exports: [
    DfaCreatorComponent,
    ControlsComponent
  ]

})
export class AutomataCreatorModule { }
