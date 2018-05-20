import * as createjs from "createjs-module";
import {DFADiagram, DiagramNodesLayer, DiagramSelectionLayer, NodeElement} from './diagram';

// A mediator class that encapsulates interaction between diagram components
export class DiagramDirector {
  // node_selection_director: NodeSelectionDirector = new NodeSelectionDirector(this);


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
    // console.log(this.diagram.ctrl_is_pressed);

    if(!this.diagram.ctrl_is_pressed){
      this.node_layer.deselectAllNodes();
    }
    this.node_layer.toggleNodeSelection(node);
  }

  deleteSelectedNodes() {
    this.node_layer.deleteSelectedNodes();
    this.updateDiagram();0
  }
}
