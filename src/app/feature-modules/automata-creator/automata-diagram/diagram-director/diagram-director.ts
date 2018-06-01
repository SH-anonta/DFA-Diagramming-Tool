import * as createjs from "createjs-module";
import {DFADiagram} from '../diagram';


import {DiagramSelectionLayer} from '../diagram-layers/selection-layer';
import {DiagramNodesLayer} from '../diagram-layers/node-layer';
import {DiagramEdgeLayer} from '../diagram-layers/edge-layer';
import {NodeElement} from '../diagram-layers/node-element';
import {ActionExecutor} from '../diagram-actions/action-executor';
import {DiagramDirectorDefaultMode, DiagramDirectorEdgeCreationMode} from './director-modes';
import {DiagramEventHandler} from './diagram-event-handler';
import {ExternalCommandsHandler} from './diagram-controls';

//todo move mouse event data out of default direct mode

export class DiagramDirector implements DiagramEventHandler, ExternalCommandsHandler {
  private action_executor = new ActionExecutor();
  public readonly default_mode: DiagramDirectorDefaultMode;
  public readonly edge_creation_mode: DiagramDirectorEdgeCreationMode;

  private current_mode:DiagramDirectorDefaultMode;

  constructor(stage: createjs.Stage,
              diagram: DFADiagram,
              selection_layer: DiagramSelectionLayer,
              node_layer: DiagramNodesLayer,
              edge_layer: DiagramEdgeLayer){

    // create default mode
    this.default_mode = new DiagramDirectorDefaultMode(this.action_executor, stage, diagram,selection_layer, node_layer, edge_layer);

    // create edge creation mode
    this.edge_creation_mode = new DiagramDirectorEdgeCreationMode(this.action_executor, stage, diagram,selection_layer, node_layer, edge_layer);

    this.current_mode = this.default_mode;
  }

  switchMode(mode: DiagramDirectorDefaultMode){
    this.current_mode.beforeSwitchHook();
    this.current_mode  = mode;
    this.current_mode.onSwitchHook();
    this.current_mode.updateDiagram();
  }

  // methods for handling events that occur on different components of the diagram
  // all methods below should delegate the call to the current_mode mode object

  updateDiagram(){
    this.current_mode.updateDiagram();
  }

  deleteButtonPressedOnPageBody() {
    this.current_mode.deleteButtonPressedOnPageBody();
  }

  ctrlZPressed(){
    this.current_mode.ctrlZPressed();
  }

  ctrlYPressed(){
    this.current_mode.ctrlYPressed();
  }

  // Selection layer action handlers
  selectionLayerClicked(event: any){
    this.current_mode.selectionLayerClicked(event);
  }

  selectionLayerDoubleClicked(event: any){
    this.current_mode.selectionLayerDoubleClicked(event);
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

  // edge event action handlers
  edgeClicked(event: any){
    this.current_mode.edgeClicked(event);
  }

  edgeDoubleClicked(event: any){
    this.current_mode.edgeDoubleClicked(event);
  }

  edgeMouseDown(event: any){
    this.current_mode.edgeMouseDown(event)
  }

  edgeMouseUp(event: any){
    this.current_mode.edgeMouseUp(event)
  }

  // edge center control point events
  edgeCenterClicked(event: any){
   this.current_mode.edgeCenterClicked(event);
  }
  edgeCenterDoubleClicked(event: any){
    this.current_mode.edgeCenterDoubleClicked(event);
  }
  edgeCenterMouseDown(event: any){
    this.current_mode.edgeCenterMouseDown(event);
  }
  edgeCenterMouseUp(event: any){
    this.current_mode.edgeCenterMouseUp(event);
  }
  edgeCenterPressMove(event: any){
    this.current_mode.edgeCenterPressMove(event);
  }

  // todo delete
  createNewEdge(nodea: NodeElement, nodeb: NodeElement){
    return this.current_mode.createNewEdge(nodea, nodeb);
  }

  undoChanges(){
    this.current_mode.undoChanges();
  }

  redoChanges(){
    this.current_mode.redoChanges();
  }

  deleteSelectedNodesOrEdge(){
    this.current_mode.deleteSelectedNodesOrEdge();
  }

  switchToDefaultMode(){
    this.current_mode = this.default_mode;
  }

  switchToEdgeCreationMode(){
    this.current_mode = this.edge_creation_mode;
  }
}
