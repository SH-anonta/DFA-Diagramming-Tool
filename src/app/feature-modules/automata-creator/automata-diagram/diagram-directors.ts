import * as createjs from "createjs-module";
import {DFADiagram} from './diagram';
import {
  ActionExecutor,
  CreateNodeAction,
  DeleteSelectedNodesAction,
  MoveNodesAction,
  ToggleNodeAcceptStateStatusAction
} from './diagram-actions';

import {DiagramSelectionLayer} from './selection-layer';
import {DiagramNodesLayer, NodeElement} from './node-layer';
import {DiagramEdgeLayer} from './edge-layer';

// todo create common interface for DiagramDirector and all director mode classes
//todo move mouse event data out of defaoult mode

export class DiagramDirector{
  private readonly default_mode: DiagramDirectorDefaultMode;
  private readonly edge_creation_mode: DiagramDirectorDefaultMode;

  private current_mode:DiagramDirectorDefaultMode;

  constructor(stage: createjs.Stage,
              diagram: DFADiagram,
              selection_layer: DiagramSelectionLayer,
              node_layer: DiagramNodesLayer,
              edge_layer: DiagramEdgeLayer){

    // create default mode
    this.default_mode = new DiagramDirectorDefaultMode(stage, diagram,selection_layer, node_layer, edge_layer);

    // create edge creation mode
    this.edge_creation_mode = new DiagramDirectorEdgeCreationMode(stage, diagram,selection_layer, node_layer, edge_layer);

    this.current_mode = this.default_mode;
  }

  // methods for switching between director's modes
  switchToDefaultMode(){
    this.current_mode  = this.default_mode;
    console.log('Switched to default mode');
  }

  switchToNodeCreationMode(){
    this.current_mode  = this.edge_creation_mode;
    console.log('Switched to edge creation mode');
  }

  // methods for handling events that occur on different components of the diagram
  // all methods below should delegate the call to the current_mode mode object

  updateDiagram(){
    this.current_mode.updateDiagram();
  }

  deleteButtonPressedOnPageBody() {
    this.current_mode.deleteButtonPressedOnPageBody();
  }

  // In response to actions performed on nodes
  nodeClicked(event: any){
    this.current_mode.nodeClicked(event);
  }

  nodeDoubleClicked(node: NodeElement){
    this.current_mode.nodeDoubleClicked(node);
  }

  nodeMouseDown(event: any){
    this.current_mode.nodeMouseDown(event);
  }


  // this method expects drag_offset property to be set on event, by mouseDown event handler
  nodePressMove(event: any){
    this.current_mode.nodePressMove(event);
  }

  nodePressUp(event: any){
    this.current_mode.nodePressUp(event);
  }

  // Selection layer action handlers

  selectionLayerClicked(event: any){
    this.current_mode.selectionLayerClicked(event);
  }

  selectionLayerDoubleClicked(event: any){
    this.current_mode.selectionLayerDoubleClicked(event);
  }

  ctrlZPressed(){
    this.current_mode.ctrlZPressed();
  }

  ctrlYPressed(){
    this.current_mode.ctrlYPressed();
  }

  // todo delete
  createNewEdge(nodea: NodeElement, nodeb: NodeElement){
    return this.current_mode.createNewEdge(nodea, nodeb);
  }

}

// A mediator class that encapsulates interaction between diagram components
export class DiagramDirectorDefaultMode {
  private action_executor: ActionExecutor = new ActionExecutor();

  constructor(private stage: createjs.Stage,
              private diagram: DFADiagram,
              private selection_layer: DiagramSelectionLayer,
              private node_layer: DiagramNodesLayer,
              private edge_layer: DiagramEdgeLayer,
  ){}

  updateDiagram(){
    this.stage.update();
  }

  setSelectionLayer(selection_layer: DiagramSelectionLayer){
    this.selection_layer = selection_layer;
  }
  setNodeLayer(node_layer: DiagramNodesLayer){
    this.node_layer = node_layer;
  }

  setEdgeLayer(edge_layer: DiagramEdgeLayer){
    this.edge_layer = edge_layer;
  }

  // event handlers
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

    if(!this.diagram.ctrl_is_pressed && !drag_performed){
      this.node_layer.deselectAllNodes();
      event.currentTarget.is_selected = true;
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

    //Values used for making decisions
    this.last_mouse_x= event.stageX;
    this.last_mouse_y= event.stageY;

    this.initial_mouse_x= event.stageX;
    this.initial_mouse_y= event.stageY;

    if(this.diagram.shift_is_pressed){

    }
    else{

      if(this.diagram.ctrl_is_pressed){
        event.currentTarget.is_selected = !event.currentTarget.is_selected;
      }
      else if(!event.currentTarget.is_selected){
        // if control is not pressed and the clicked node is not selected
        this.node_layer.deselectAllNodes();
        event.currentTarget.is_selected = true;
      }
    }

    this.updateDiagram();
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

    // console.log('Press Move');
  }

  nodePressUp(event: any){
    // moving of nodes has been completed
    // console.log('Press up');

    let dx = event.stageX-this.initial_mouse_x;
    let dy = event.stageY-this.initial_mouse_y;

    // if the has moved after mouesdown event was fired
    if(dx != 0 || dy != 0){
      let selected_nodes = this.node_layer.getSelectedNodes();
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

  // todo delete
  createNewEdge(nodea: NodeElement, nodeb: NodeElement){
    return this.edge_layer.createEdge(nodea, nodeb);
  }
}


enum EdgeCreationStage{
  initial,
  src_node_selected,
  destination_node_selected
}

export class DiagramDirectorEdgeCreationMode extends DiagramDirectorDefaultMode{
  private creation_stage = EdgeCreationStage.initial;

  constructor(stage: createjs.Stage,
              diagram: DFADiagram,
              selection_layer?: DiagramSelectionLayer,
              node_layer?: DiagramNodesLayer,
              edge_layer?: DiagramEdgeLayer){

    super(stage, diagram, selection_layer, node_layer, edge_layer);
  }



  nodeMouseDown(event: any){
    if(this.creation_stage == EdgeCreationStage.initial){

    }
    else if(this.creation_stage == EdgeCreationStage.src_node_selected){

    }
  }

  nodeClicked(event: any){

  }
}
