import * as createjs from "createjs-module";
import {DFADiagram, DiagramNodesLayer, DiagramSelectionLayer, NodeElement} from './diagram';



export class NodeSelectionDirector {
  selected_nodes: NodeElement[]= [];

  constructor(private director: DiagramDirector){

  }

  toggleNodeSelection(node: NodeElement){

    let idx = this.selected_nodes.findIndex(value => value === node);
    if(idx != -1){
      node.hideSelectionBorder();
      this.selected_nodes.splice(idx, 1);
    }
    else{
      node.showSelectionBorder();
      this.selected_nodes.push(node);
    }

    this.director.updateDiagram();
  }

  clearSelection(){
    this.selected_nodes.forEach(x => x.hideSelectionBorder());
    this.selected_nodes.splice(0, this.selected_nodes.length);
  }
}

// A mediator class that encapsulates interaction between diagram components
export class DiagramDirector {
  node_selection_director: NodeSelectionDirector = new NodeSelectionDirector(this);


  constructor(private stage: createjs.Stage,
              private diagram: DFADiagram,
              private selection_layer?: DiagramSelectionLayer,
              private node_layer?: DiagramNodesLayer,
  ){


  }

  updateDiagram(){
    this.stage.update();
  }

  createNode(label: string, x: number, y: number) {
    this.node_layer.createNewNode(label, x, y);
    this.updateDiagram();
  }
  setSelectionLayer(selection_layer: DiagramSelectionLayer){
    this.selection_layer = selection_layer;
  }
  setNodeLayer(node_layer: DiagramNodesLayer){
    this.node_layer = node_layer;
  }


  toggleNodeSelection(node: NodeElement) {
    console.log(this.diagram.ctrl_is_pressed);

    if(!this.diagram.ctrl_is_pressed){
      console.log('AAAAAAAAAAAAA');
      this.node_selection_director.clearSelection();
    }
    this.node_selection_director.toggleNodeSelection(node);
  }
}
