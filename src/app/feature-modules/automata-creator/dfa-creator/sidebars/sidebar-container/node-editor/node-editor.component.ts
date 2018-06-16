import {Component, Input, OnInit} from '@angular/core';
import {NodeElement} from '../../../../automata-diagram/diagram-layers/node-element';

@Component({
  selector: 'dfa-node-editor',
  templateUrl: './node-editor.component.html',
  styleUrls: ['./node-editor.component.css']
})
export class NodeEditorComponent implements OnInit {
  @Input() selected_node: NodeElement;   // todo replace with model


  constructor() { }

  ngOnInit() {
  }

}
