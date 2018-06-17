import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Selectable} from '../../../models/selectable.model';
import {DFADiagram} from '../../../automata-diagram/diagram';
import {Node} from "../../../models/node.model"
import {NodeElement} from '../../../automata-diagram/diagram-layers/node-element';
import {DiagramService} from '../../../diagram.service';

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
  selection: Selectable;

  current_sidebar: DfaCreatorSidebar = DfaCreatorSidebar.blank;

  // sidebars enums, this is needed becaues the template cannot access the Sidebar enum directly
  node_editor_sidebar = DfaCreatorSidebar.node_editor;
  edge_editor_sidebar = DfaCreatorSidebar.edge_editor;
  blank_sidebar = DfaCreatorSidebar.blank;

  constructor(public diagram_provider: DiagramService) { }

  ngOnInit() {
    this.setEventListeners();
  }

  private updateSidebarType(elements: Selectable[]){
    // console.log(elements);

    // all sidebars are meant to deal with only one selected element
    if(elements.length != 1){
      this.current_sidebar = this.blank_sidebar;
      return;
    }

    // todo use Node model class instead of Node element
    if(elements[0] instanceof NodeElement){
      this.current_sidebar = this.node_editor_sidebar;
    }
    else{
      this.current_sidebar = this.blank_sidebar;
    }
  }

  setEventListeners(){
    // event listeners for dfa_diagram
    this.diagram_provider.diagram.subscribeToNodeSelection((selection: Selectable[])=>{
      this.selection= selection[0];

      this.updateSidebarType(selection);
    });
  }


}
