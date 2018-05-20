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


  deleteButtonPressedOnPageBody() {
    // delete button pressed outside of any input fields.
    // this indicates the ues wants to delete selected nodes
    this.node_layer.deleteSelectedNodes();
    this.updateDiagram();
  }

  // In response to actions performed on nodes
  nodeClicked(node: NodeElement){
    if(!this.diagram.ctrl_is_pressed){
      this.node_layer.deselectAllNodes();
    }

    node.is_selected= !node.is_selected;
    this.updateDiagram();
  }

  nodeDoubleClicked(node: NodeElement){
    node.is_accept_state = !node.is_accept_state;
    this.updateDiagram();
  }

  nodeMouseDown(event: any){
    event.currentTarget.drag_offset = {x : event.localX, y: event.localY};
  }

  nodePressMove(event: any){
    event.currentTarget.x = event.stageX - event.currentTarget.drag_offset.x;
    event.currentTarget.y = event.stageY - event.currentTarget.drag_offset.y;
    this.updateDiagram();
  }
}
