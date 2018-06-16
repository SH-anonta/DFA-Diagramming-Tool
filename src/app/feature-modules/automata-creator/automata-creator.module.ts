import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DfaCreatorComponent } from './dfa-creator/dfa-creator.component';
import { ControlsComponent } from './dfa-creator/controls/controls.component';
import { EdgeEditorComponent } from './dfa-creator/sidebars/edge-editor/edge-editor.component';
import { NodeEditorComponent } from './dfa-creator/sidebars/node-editor/node-editor.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DfaCreatorComponent,
    ControlsComponent,
    EdgeEditorComponent,
    NodeEditorComponent,
    EdgeEditorComponent,
  ],
  exports: [
    DfaCreatorComponent,
    ControlsComponent
  ],
  providers: [

  ]

})
export class AutomataCreatorModule { }
