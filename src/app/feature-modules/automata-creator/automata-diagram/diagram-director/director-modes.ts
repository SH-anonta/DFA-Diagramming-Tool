import {DFADiagram} from '../diagram';
import {DiagramSelectionLayer} from '../diagram-layers/selection-layer';
import {DiagramNodesLayer} from '../diagram-layers/node-layer';
import {DiagramEdgeLayer} from '../diagram-layers/edge-layer';
import {
  CreateEdgeAction,
  CreateNodeAction,
  DeleteEdgeAction,
  DeleteSelectedNodesAction,
  MoveNodesAction,
  ToggleNodeAcceptStateStatusAction
} from '../diagram-actions/actions';
import {NodeElement} from '../diagram-layers/node-element';
import {EdgeElement} from '../diagram-layers/edge-element';
import {DiagramEventHandler} from './diagram-event-handler';
import {ActionExecutor} from '../diagram-actions/action-executor';
import {ExternalCommandsHandler} from './diagram-controls';

// todo: move 'press move performed' calculation into this class
class MouseData {
  static initial_mouse_x= 0;
  static initial_mouse_y= 0;
  static last_mouse_x= 0;
  static last_mouse_y= 0;
}

export class DiagramDirectorDefaultMode implements DiagramEventHandler, ExternalCommandsHandler{

  constructor(protected action_executor: ActionExecutor,
              protected stage: createjs.Stage,
              protected diagram: DFADiagram,
              protected selection_layer: DiagramSelectionLayer,
              protected node_layer: DiagramNodesLayer,
              protected edge_layer: DiagramEdgeLayer,
  ){}

  updateDiagram(){
    this.stage.update();
  }

  // event handlers
  deleteButtonPressedOnPageBody() {
    // delete button pressed outside of any input fields.
    // this indicates the ues wants to delete selected nodes or the selected edge

    if(this.node_layer.getSelectedNodes().length > 0){
      this.action_executor.execute(new DeleteSelectedNodesAction(this.node_layer, this.edge_layer));
    }

    let selected_edge = this.edge_layer.getSelectedEdge();
    if(selected_edge != null){
      this.action_executor.execute(new DeleteEdgeAction(this.edge_layer, selected_edge));
    }

    this.updateDiagram();
  }

  // In response to actions performed on nodes
  nodeClicked(event: any){
    let dx = event.stageX - MouseData.initial_mouse_x;
    let dy = event.stageY - MouseData.initial_mouse_y;
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

  nodeMouseDown(event: any){
    // drag_offset is used to keep track of where the mouse pointer is pressed on the node element
    event.currentTarget.drag_offset = {x : event.localX, y: event.localY};

    //Values used for making decisions
    MouseData.last_mouse_x= event.stageX;
    MouseData.last_mouse_y= event.stageY;

    MouseData.initial_mouse_x= event.stageX;
    MouseData.initial_mouse_y= event.stageY;

    this.edge_layer.deselectAllEdges();

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

    let tx=  event.stageX - MouseData.last_mouse_x;
    let ty=  event.stageY - MouseData.last_mouse_y;

    this.node_layer.translateSelectedNodes(tx, ty);

    MouseData.last_mouse_x= event.stageX;
    MouseData.last_mouse_y= event.stageY;

    this.updateDiagram();

    // console.log('Press Move');
  }

  nodePressUp(event: any){
    // moving of nodes has been completed
    // console.log('Press up');

    let dx = event.stageX-MouseData.initial_mouse_x;
    let dy = event.stageY-MouseData.initial_mouse_y;

    // if the has moved after mouesdown event was fired
    if(dx != 0 || dy != 0){
      let selected_nodes = this.node_layer.getSelectedNodes();
      this.action_executor.execute(new MoveNodesAction(selected_nodes,dx,dy));
    }
  }

  // Selection layer action handlers

  selectionLayerClicked(event: any){
    this.node_layer.deselectAllNodes();
    this.edge_layer.deselectAllEdges();
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

  // this method gets called when the director switches to this mode
  onSwitchHook(){
    // intentionally do nothing
  }

  // this method gets called before the director mode gets switched
  beforeSwitchHook(){

  }

  edgeClicked(event: any) {
    // console.log('Edge clicked');
    this.node_layer.deselectAllNodes();
    this.edge_layer.selectEdge(event.currentTarget);
    this.updateDiagram();
  }

  edgeDoubleClicked(event: any){

  }
  edgeMouseDown(event: any){

  }

  edgeMouseUp(event: any){

  }

  // edge center control point events
  edgeCenterClicked(event: any){
    // prevent the edge element right below this point from receiving this event
    // event.stopPropagation();

    // console.log(event.currentTarget);
  }
  edgeCenterDoubleClicked(event: any){

  }
  edgeCenterMouseDown(event: any){

  }
  edgeCenterMouseUp(event: any){

  }
  edgeCenterPressMove(event: any){
    // prevent the edge element right below this point from receiving this event
    event.stopPropagation();

    console.log('press');
    let edge = event.currentTarget.getParentEdge();
    edge.setCenterControlPointPosition(event.stageX, event.stageY);
    this.updateDiagram();
  }

  // commands sent from outside of the diagram, by method call and not by some event
  undoChanges(){
    this.action_executor.undoAction();
    this.updateDiagram();
  }

  redoChanges(){
    this.action_executor.redoAction();
    this.updateDiagram();
  }

  deleteSelectedNodesOrEdge(){
    // delete button pressed outside of any input fields.
    // this indicates the ues wants to delete selected nodes or the selected edge

    if(this.node_layer.getSelectedNodes().length > 0){
      this.action_executor.execute(new DeleteSelectedNodesAction(this.node_layer, this.edge_layer));
    }

    let selected_edge = this.edge_layer.getSelectedEdge();
    if(selected_edge != null){
      this.action_executor.execute(new DeleteEdgeAction(this.edge_layer, selected_edge));
    }

    this.updateDiagram();
  }

  switchToDefaultMode(){
    // dummy methods, not to be used
    // exists only because the ExternalCommandsHandler interface requires it
  }

  switchToEdgeCreationMode(){
    // dummy methods, not to be used
    // exists only because the ExternalCommandsHandler interface requires it
  }
}


enum EdgeCreationPhase{
  source_node_selection,
  destination_node_selection,
}

export class DiagramDirectorEdgeCreationMode extends DiagramDirectorDefaultMode{
  private current_phase: EdgeCreationPhase = EdgeCreationPhase.source_node_selection;
  private floating_edge: EdgeElement;


  constructor(action_executor,
              stage: createjs.Stage,
              diagram: DFADiagram,
              selection_layer?: DiagramSelectionLayer,
              node_layer?: DiagramNodesLayer,
              edge_layer?: DiagramEdgeLayer){

    super(action_executor, stage, diagram, selection_layer, node_layer, edge_layer);
  }

  beforeSwitchHook(){
    if(this.current_phase == EdgeCreationPhase.source_node_selection){
      this.edge_layer.removeFloatingEdge();
    }
  }

  // mouse events
  nodeMouseDown(event: any){
    if(this.current_phase == EdgeCreationPhase.source_node_selection){
      let x = event.currentTarget.x;
      let y = event.currentTarget.y;

      this.floating_edge = this.edge_layer.createFloatingEdge(x,y,x,y);
      this.current_phase = EdgeCreationPhase.destination_node_selection;

      this.floating_edge.setSourcePosition(event.currentTarget.x, event.currentTarget.y);

      this.updateDiagram();
    }
  }

  nodeClicked(event: any){
    console.log('Node click');
    this.updateDiagram();
  }


  // Important: This method gets called even if the mouse is not on top of a node
  // the currentTarget of event is set to the node which was pressed on at first
  nodePressUp(event: any){

    if(this.current_phase == EdgeCreationPhase.destination_node_selection){
      // console.log('dest', event.currentTarget.label);


      // this either returns a node element which is under the mouse pointer
      // or returns false if no node is under the mouse pointer
      let destination_node: any= this.node_layer.getNodeAtStagePosition(event.stageX, event.stageY);
      if(destination_node === false){
        console.log('Node hit not detected');
        this.edge_layer.removeFloatingEdge();
      }
      else{
        // this.floating_edge.setDestinationPosition(destination_node.x, destination_node.y);

        this.floating_edge.setSourceNode(event.currentTarget);
        this.floating_edge.setDestinationNode(destination_node);

        // associate the edge to the destination node and source node
        // so it is connected to them

        this.floating_edge.updateEdgePosition();
        this.action_executor.execute(new CreateEdgeAction(this.edge_layer, this.floating_edge));

        // now that the edge is associated with two nodes
        // it is no longer a floating node
        this.edge_layer.undefineFloatingEdge();
        this.floating_edge = undefined;
      }

      this.current_phase = EdgeCreationPhase.source_node_selection;
      this.updateDiagram();
    }
  }

  nodePressMove(event){
    if(this.current_phase == EdgeCreationPhase.destination_node_selection){
      this.floating_edge.setDestinationPosition(event.stageX, event.stageY);
      this.updateDiagram();
    }
  }

  // edge events, disable default behaviour of edges

  edgeClicked(event: any) {
  }

  edgeDoubleClicked(event: any){
  }
  edgeMouseDown(event: any){
  }

  edgeMouseUp(event: any){
  }
}
