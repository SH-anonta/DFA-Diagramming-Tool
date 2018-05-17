import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DfaCreatorComponent} from './dfa-creator/dfa-creator.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DfaCreatorComponent
  ],
  exports: [
    DfaCreatorComponent
  ]

})
export class AutomataCreatorModule { }
