import {Component, Input, OnInit} from '@angular/core';
import {NodeElement} from '../../../../automata-diagram/diagram-layers/node-element';
import {DiagramService} from '../../../../diagram.service';

@Component({
  selector: 'dfa-node-editor',
  templateUrl: './node-editor.component.html',
  styleUrls: ['./node-editor.component.css']
})
export class NodeEditorComponent implements OnInit {
  @Input() selected_node: NodeElement;   // todo replace with model


  constructor(public diagram_provider: DiagramService) {
  }

  ngOnInit() {
  }

  onNodeRename(event){
    let val = event.target.value;
    // console.log();

    //todo update lable through diagram object method
    this.selected_node.label= val;
  }

}
