import {Component, Input, OnInit} from '@angular/core';
import {EdgeElement} from '../../../../automata-diagram/diagram-layers/edge-element';
import {DiagramService} from '../../../../diagram.service';

@Component({
  selector: 'dfa-edge-editor',
  templateUrl: './edge-editor.component.html',
  styleUrls: ['./edge-editor.component.css']
})
export class EdgeEditorComponent implements OnInit {

  // todo turn this into edge model.
  @Input() selected_edge: EdgeElement;

  constructor(public diagram_service: DiagramService) { }

  ngOnInit() {
  }

  onStraightenEdgeClick() {
    this.diagram_service.diagram.straightenSelectedEdge();
  }
}
