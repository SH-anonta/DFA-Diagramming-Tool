import * as createjs from "createjs-module";
import {DFADiagram, DiagramNodesLayer, DiagramSelectionLayer, NodeElement} from './diagram';
import {ActionExecutor, DeleteSelectedNodesAction} from './diagram-actions';

// A mediator class that encapsulates interaction between diagram components
export class DiagramDirector {
  private action_executor: ActionExecutor = new ActionExecutor();

  constructor(private stage: createjs.Stage,
              private diagram: DFADiagram,
              private selection_layer?: DiagramSelectionLayer,
              private node_layer?: DiagramNodesLayer,
  ){

  }

  updateDiagram(){
    this.stage.update();
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
    // this.node_layer.deleteSelectedNodes();

    this.action_executor.executeAction(new DeleteSelectedNodesAction(this.node_layer));

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
    // drag_offset is used to keep track of where the mouse pointer is pressed on the node element
    event.currentTarget.drag_offset = {x : event.localX, y: event.localY};
  }

  // this method expects drag_offset property to be set on event, by mouseDown event handler
  nodePressMove(event: any){
    event.currentTarget.x = event.stageX - event.currentTarget.drag_offset.x;
    event.currentTarget.y = event.stageY - event.currentTarget.drag_offset.y;
    this.updateDiagram();
  }

  // Selection layer action handlers

  selectionLayerClicked(event: any){
    this.node_layer.deselectAllNodes();
    this.updateDiagram();
  }

  selectionLayerDoubleClicked(event: any){
    this.node_layer.createNewNode('New', event.stageX, event.stageY);
    this.updateDiagram();
  }

  ctrlZPresed(){
    this.action_executor.undoAction();
    this.updateDiagram();
  }

  ctrlYPresed(){
    this.action_executor.redoAction();
    this.updateDiagram();
  }
}
