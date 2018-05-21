import * as createjs from "createjs-module";
import {DFADiagram, DiagramNodesLayer, DiagramSelectionLayer, NodeElement} from './diagram';
import {
  ActionExecutor,
  CreateNodeAction,
  DeleteSelectedNodesAction,
  MoveNodesAction,
  ToggleNodeAcceptStateStatusAction
} from './diagram-actions';
import {zipStatic} from 'rxjs/operators/zip';

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

    this.action_executor.execute(new DeleteSelectedNodesAction(this.node_layer));

    this.updateDiagram();
  }

  // In response to actions performed on nodes
  nodeClicked(event: any){
    let dx = event.stageX - this.initial_mouse_x;
    let dy = event.stageY - this.initial_mouse_y;
    let drag_performed = !(dx == 0 && dy == 0);

    if(!this.diagram.ctrl_is_pressed){
      if(!drag_performed){
        this.node_layer.deselectAllNodes();
      }
      event.currentTarget.is_selected = true;
    }
    else{
      event.currentTarget.is_selected = !event.currentTarget.is_selected;
    }



    this.updateDiagram();
  }

  nodeDoubleClicked(node: NodeElement){
    this.action_executor.execute(new ToggleNodeAcceptStateStatusAction(this.node_layer, node));
    this.updateDiagram();
  }

  initial_mouse_x= 0;
  initial_mouse_y= 0;
  last_mouse_x= 0;
  last_mouse_y= 0;

  nodeMouseDown(event: any){
    // drag_offset is used to keep track of where the mouse pointer is pressed on the node element

    event.currentTarget.drag_offset = {x : event.localX, y: event.localY};
    this.last_mouse_x= event.stageX;
    this.last_mouse_y= event.stageY;

    this.initial_mouse_x= event.stageX;
    this.initial_mouse_y= event.stageY;
  }

  // this method expects drag_offset property to be set on event, by mouseDown event handler
  nodePressMove(event: any){
    // event.currentTarget.x = event.stageX - event.currentTarget.drag_offset.x;
    // event.currentTarget.y = event.stageY - event.currentTarget.drag_offset.y;

    let tx=  event.stageX - this.last_mouse_x;
    let ty=  event.stageY - this.last_mouse_y;

    this.node_layer.translateSelectedNodes(tx, ty);

    this.last_mouse_x= event.stageX;
    this.last_mouse_y= event.stageY;

    this.updateDiagram();

    console.log('Press Move');
  }

  nodePressUp(event: any){
    // moving of nodes has been completed
    // console.log('Press up');

    let dx = event.stageX-this.initial_mouse_x;
    let dy = event.stageY-this.initial_mouse_y;

    // if the has moved after mouesdown event was fired
    if(dx != 0 || dy != 0){
      let selected_nodes = this.node_layer.getSelectedNodes();
      console.log(selected_nodes);
      this.action_executor.execute(new MoveNodesAction(selected_nodes,dx,dy));
    }
  }

  // Selection layer action handlers

  selectionLayerClicked(event: any){
    this.node_layer.deselectAllNodes();
    this.updateDiagram();
  }

  selectionLayerDoubleClicked(event: any){
    this.action_executor.execute(new CreateNodeAction(this.node_layer, 'New', event.stageX, event.stageY));
    this.updateDiagram();
  }

  ctrlZPressed(){
    this.action_executor.undoAction();
    this.updateDiagram();
  }

  ctrlYPressed(){
    this.action_executor.redoAction();
    this.updateDiagram();
  }
}
