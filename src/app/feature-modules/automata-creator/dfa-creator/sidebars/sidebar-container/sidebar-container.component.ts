import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Selectable} from '../../../models/selectable.model';
import {DFADiagram} from '../../../automata-diagram/diagram';


// todo move to another file
export enum DfaCreatorSidebar {
  node_editor,
  edge_editor,
  blank,
}


@Component({
  selector: 'dfa-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.css']
})
export class SidebarContainerComponent implements OnInit {
  @Input() dfa_diagram: DFADiagram;

  current_sidebar: DfaCreatorSidebar = DfaCreatorSidebar.blank;

  // sidebars enums, this is needed becaues the template cannot access the Sidebar enum directly
  node_editor_sidebar = DfaCreatorSidebar.node_editor;
  edge_editor_sidebar = DfaCreatorSidebar.edge_editor;
  blank_sidebar = DfaCreatorSidebar.blank;

  constructor() { }

  ngOnInit() {
    this.setEventListeners();
  }

  updateSelected(elements: Selectable[]){
    // todo check if array length is 1 else set blank panel
    if(elements[0] instanceof Node){
      this.current_sidebar = this.node_editor_sidebar;
    }
    else{
      this.current_sidebar = this.blank_sidebar;
    }
  }

  setEventListeners(){
    // event listeners for dfa_diagram
    this.dfa_diagram.subscribeToNodeSelection((selection: Selectable[])=>{
      console.log('selected: ', selection);
    });
  }


}
