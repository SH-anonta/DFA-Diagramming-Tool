import {DFADiagram} from '../diagram';
import {DiagramSelectionLayer, SelectionOverlayLayer, SelectionRect} from '../diagram-layers/selection-layer';
import {DiagramNodesLayer} from '../diagram-layers/node-layer';
import {DiagramEdgeLayer} from '../diagram-layers/edge-layer';
import {
  CreateEdgeAction,
  CreateNodeAction,
  DeleteEdgeAction,
  DeleteSelectedNodesAction,
  MoveNodesAction, MoveEdgeCentroid,
  ToggleNodeAcceptStateStatusAction, RenameNodeAction
} from '../diagram-actions/actions';
import {NodeElement} from '../diagram-layers/node-element';
import {DiagramEventHandler} from './diagram-event-handler';
import {ActionExecutor} from '../diagram-actions/action-executor';
import {ExternalCommandsHandler} from './diagram-controls';
import {QuadCurveLine} from '../diagram-layers/quad-curve-line';
import {AlignmentGuidelineLayer} from '../diagram-layers/alignment-guideline-layer';

// todo Make all diagram manupulations through action objects, even the ones that aren't to be undone

// todo: update values in this class from a safer place, as of now DirectorMode classes are updating them
class MouseData {
  // where the mouse was located when the last 'mouse down' event was fired
  static initial_mouse_x= 0;
  static initial_mouse_y= 0;

  // where the mouse was located when the last 'press move' event was fired
  static last_mouse_x= 0;
  static last_mouse_y= 0;

  // static dragPerformed(): boolean{
  //   return MouseData.initial_mouse_x == this.last_mouse_x && MouseData.initial_mouse_y == this.last_mouse_y;
  // }
}

export class DirectorDefaultMode implements DiagramEventHandler, ExternalCommandsHandler{
  // How many units to tolerate when considering if two nodes are aligned (horizontally or vertically)
  protected readonly ALIGNMENT_DELTA= 5;

  constructor(protected action_executor: ActionExecutor,
              protected stage: createjs.Stage,
              protected diagram: DFADiagram,
              protected selection_layer: DiagramSelectionLayer,
              protected node_layer: DiagramNodesLayer,
              protected edge_layer: DiagramEdgeLayer,
              protected selection_overlay_layer: SelectionOverlayLayer,
              protected alignment_guideline_layer: AlignmentGuidelineLayer){}

  // dfa_diagram notifications

  // send event with whatever is currently selected
  sendSelectionEvent(selection){
    if(!selection.isEmpty){
      this.diagram.element_selection_subject.next(selection);
    }
  }

  updateDiagram(){
    this.stage.update();
  }

  // In response to actions performed on nodes
  nodeClicked(event: any){
    let dx = event.stageX - MouseData.initial_mouse_x;
    let dy = event.stageY - MouseData.initial_mouse_y;
    let drag_performed = !(dx == 0 && dy == 0);

    // let drag_performed = MouseData.dragPerformed();

    if(!this.diagram.ctrl_is_pressed && !drag_performed){
      this.node_layer.deselectAllNodes();
      event.currentTarget.is_selected = true;
    }

    this.sendSelectionEvent(this.node_layer.getSelectedNodes());
    this.updateDiagram();
  }

  nodeDoubleClicked(node: NodeElement){
    this.action_executor.execute(new ToggleNodeAcceptStateStatusAction(this.node_layer, node));
    this.updateDiagram();
  }

  nodeMouseDown(event: any){
    // todo collect this data from another location, possibly the main event handlers of dfa_diagram
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
    let tx=  event.stageX - MouseData.last_mouse_x;
    let ty=  event.stageY - MouseData.last_mouse_y;

    this.node_layer.translateSelectedNodes(tx, ty);

    MouseData.last_mouse_x= event.stageX;
    MouseData.last_mouse_y= event.stageY;

    // update the guidelines for aligned nodes
    // clean up
    this.alignment_guideline_layer.clearAllGuideLines();
    let almost_aligned_points = this.node_layer.getAlmostAlignedNodePositions(event.currentTarget,this.ALIGNMENT_DELTA);

    this.alignment_guideline_layer.createHorizontalLines(almost_aligned_points.horizontal);
    this.alignment_guideline_layer.createVerticalLines(almost_aligned_points.vertical);

    this.updateDiagram();
  }

  nodePressUp(event: any){
    // moving of nodes has been completed
    // clean up all guidelines
    this.alignment_guideline_layer.clearAllGuideLines();

    let node = event.currentTarget;

    // distance from node's initial position to it's new position
    let dx = event.stageX-MouseData.initial_mouse_x;
    let dy = event.stageY-MouseData.initial_mouse_y;

    // how much to translate the node's position to align it with other nodes
    let tx = 0;
    let ty = 0;

    // todo refactor this part for more simplicity, possibly move this to node layer
    if((dx != 0 || dy != 0) && this.node_layer.getSelectedNodes().length == 1){
      let horizontals = this.node_layer.getHorizontallyAlignedNodePositions(event.currentTarget, this.ALIGNMENT_DELTA);
      let verticals = this.node_layer.getVerticallyAlignedNodePositions(event.currentTarget, this.ALIGNMENT_DELTA);

      if(horizontals.length > 0){
        ty=  horizontals[0].y - node.y;
        dy= horizontals[0].y-MouseData.initial_mouse_y;
      }

      if(verticals.length > 0){
        tx=  verticals[0].x - node.x;
        dx= verticals[0].x-MouseData.initial_mouse_x;
      }

      event.currentTarget.translatePosition(tx, ty);
    }

    // if the has moved after mouesdown event was fired
    if(dx != 0 || dy != 0){
      let selected_nodes = this.node_layer.getSelectedNodes();
      this.action_executor.execute(new MoveNodesAction(selected_nodes,dx,dy));
    }

    this.updateDiagram();
  }

  // Selection layer action handlers

  // todo move to somewhere else
  selection_rect: SelectionRect;

  // todo add selection mechanism for selecting edges
  selectionLayerClicked(event: any){
    this.node_layer.deselectAllNodes();
    this.edge_layer.deselectAllEdges();
    this.updateDiagram();

    // nothing is selected
    // this.sendSelectionEvent([]);
  }

  selectionLayerDoubleClicked(event: any){
    this.action_executor.execute(new CreateNodeAction(this.node_layer, 'New', event.stageX, event.stageY));
    this.updateDiagram();
  }

  selectionLayerMouseUp(event: any){
    let points = this.selection_rect.getSelectionPoints();
    this.selection_overlay_layer.removeSelectionRectangle();

    let selected_nodes = this.node_layer.getNodesWithinRect(points.top_left.x, points.top_left.y, points.bottom_right.x, points.bottom_right.y);
    this.node_layer.selectNodes(selected_nodes);

    this.sendSelectionEvent(selected_nodes);
    this.updateDiagram();
  }
  selectionLayerPressDown(event: any){
    this.selection_rect = this.selection_overlay_layer.createSelectionRectangle(event.stageX, event.stageY);
    this.updateDiagram();
  }
  selectionLayerPressMove(event: any){
    this.selection_rect.setBottomRightPoint(event.stageX, event.stageY);
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
    this.selection_overlay_layer.removeSelectionRectangle();
  }

  edgeClicked(event: any) {
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
  }
  edgeCenterDoubleClicked(event: any){

  }
  edgeCenterMouseDown(event: any){
    MouseData.initial_mouse_x = event.stageX;
    MouseData.initial_mouse_y = event.stageY;
  }

  edgeCenterMouseUp(event: any){
    // todo, do action only if pressmove was performed
    this.action_executor.execute(new MoveEdgeCentroid(event.currentTarget.getParentEdge(),
      {x: MouseData.initial_mouse_x, y: MouseData.initial_mouse_y},
      {x: event.stageX, y: event.stageY}));
  }

  edgeCenterPressMove(event: any){
    // prevent the edge element right below this point from receiving this event
    event.stopPropagation();

    let edge = event.currentTarget.getParentEdge();
    edge.setEdgeCenterPointPosition(event.stageX, event.stageY);
    this.updateDiagram();
  }

  // commands sent from outside of the dfa_diagram, by method call and not by some event
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

  renameSelectedNode(name: string) {
    let selected:NodeElement[] = this.node_layer.getSelectedNodes();

    // only one node will be renamed
    // if multiple nodes are selected, operation is aborted
    if(selected.length == 1){
      this.action_executor.execute(new RenameNodeAction(selected[0], name))
    }

    this.updateDiagram();
  }
}

enum EdgeCreationPhase{
  source_node_selection,
  destination_node_selection,
}

export class DirectorEdgeCreationMode extends DirectorDefaultMode{
  private current_phase: EdgeCreationPhase = EdgeCreationPhase.source_node_selection;
  private floating_line: QuadCurveLine;


  constructor(action_executor,
              stage: createjs.Stage,
              diagram: DFADiagram,
              selection_layer: DiagramSelectionLayer,
              node_layer: DiagramNodesLayer,
              edge_layer: DiagramEdgeLayer,
              selection_overlay_layer: SelectionOverlayLayer,
              alignment_guideline_layer: AlignmentGuidelineLayer){

    super(action_executor, stage, diagram, selection_layer, node_layer, edge_layer, selection_overlay_layer, alignment_guideline_layer);
  }

  beforeSwitchHook(){
    // console.log('AAAAAAAAAA');
    if(this.current_phase != EdgeCreationPhase.source_node_selection){
      this.edge_layer.removeFloatingLine();
    }
  }

  // mouse events
  nodeMouseDown(event: any){
    if(this.current_phase == EdgeCreationPhase.source_node_selection){
      let x = event.currentTarget.x;
      let y = event.currentTarget.y;

      this.floating_line = this.edge_layer.createFloatingLine(x,y,x,y);
      this.current_phase = EdgeCreationPhase.destination_node_selection;

      this.floating_line.setSourcePosition(event.currentTarget.x, event.currentTarget.y);

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

      // this either returns a node element which is under the mouse pointer
      // or returns false if no node is under the mouse pointer
      let destination_node: any= this.node_layer.getNodeAtStagePosition(event.stageX, event.stageY);
      if(destination_node === false){
        console.log('Node hit not detected');
      }
      else{
        // associate the edge to the destination node and source node
        // so it is connected to them
        // this.floating_edge.

        this.action_executor.execute(new CreateEdgeAction(this.edge_layer, event.currentTarget,destination_node));

        // now that the edge is associated with two nodes
        // it is no longer a floating node
        this.floating_line = undefined;
      }

      this.current_phase = EdgeCreationPhase.source_node_selection;
      this.edge_layer.removeFloatingLine();
      this.updateDiagram();
    }
  }

  nodePressMove(event){
    if(this.current_phase == EdgeCreationPhase.destination_node_selection){
      this.floating_line.setDestinationPosition(event.stageX, event.stageY);
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
