import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DfaCreatorComponent } from './dfa-creator/dfa-creator.component';
import { ControlsComponent } from './dfa-creator/controls/controls.component';
import { EdgeEditorComponent } from './dfa-creator/sidebars/sidebar-container/edge-editor/edge-editor.component';
import { NodeEditorComponent } from './dfa-creator/sidebars/sidebar-container/node-editor/node-editor.component';
import { SidebarContainerComponent } from './dfa-creator/sidebars/sidebar-container/sidebar-container.component';

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
    SidebarContainerComponent,
  ],
  exports: [
    DfaCreatorComponent,
    ControlsComponent
  ],
  providers: [
  ]

})
export class AutomataCreatorModule { }
