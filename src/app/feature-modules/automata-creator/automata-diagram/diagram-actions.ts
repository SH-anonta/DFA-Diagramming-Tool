import {DiagramNodesLayer} from './node-layer';
import {DiagramEdgeLayer} from './edge-layer';
import {EdgeElement} from './edge-element';
import {NodeElement} from './node-element';

export class ActionExecutor{
  // stacks for keeping track of what actions have been executed
  // this also allows easy implementation of undo, redo mechanisms
  private done_actions: Action[]= [];
  private undone_actions: Action[]= [];

  // Max size of undo, redo stacks
  readonly MAX_ACTION_HISTORY_COUNT= 100;

  private clearUndoneActions(){
    this.undone_actions.splice(0, this.undone_actions.length);
  }

  execute(action: Action){
    // important is important in case action.redo() raises an exception
    action.execute();
    this.done_actions.push(action);
    this.clearUndoneActions();
  }

  undoAction(){
    if(this.done_actions.length > 0){
      let action:Action = this.done_actions.pop();
      action.undo();
      this.undone_actions.push(action);
    }

    if(this.undone_actions.length > this.MAX_ACTION_HISTORY_COUNT){
      // if max history limit will be crossed, discard the oldest action
      this.done_actions.splice(0, 1);
    }
  }

  redoAction(){

    if(this.undone_actions.length > 0) {
      let action: Action = this.undone_actions.pop();
      action.redo();
      this.done_actions.push(action);
    }
  }
}

// action classes that encapsulate logic for manipulating the diagram

export interface Action{
  execute();
  redo();
  undo();
}


// Actions performed on node elements
export class DeleteSelectedNodesAction implements Action{
  private deleted_nodes: NodeElement[];
  private incident_edges_of_deleted_nodes: EdgeElement[]= [];

  constructor(private node_layer: DiagramNodesLayer, private edge_layer: DiagramEdgeLayer){
    this.deleted_nodes = node_layer.getSelectedNodes();

    for(let node of this.deleted_nodes){
      this.incident_edges_of_deleted_nodes = this.incident_edges_of_deleted_nodes.concat(edge_layer.getIncidentEdges(node));

    }
  }

  execute(){
    this.node_layer.deleteNodes(this.deleted_nodes);
    for(let edge of this.incident_edges_of_deleted_nodes){
      this.edge_layer.removeEdge(edge);
    }
  }

  redo(){
    this.node_layer.deleteNodes(this.deleted_nodes);
    for(let edge of this.incident_edges_of_deleted_nodes){
      this.edge_layer.removeEdge(edge);
    }
  }

  undo(){
    this.node_layer.addNodes(this.deleted_nodes);
    for(let edge of this.incident_edges_of_deleted_nodes){
      this.edge_layer.addEdge(edge);
    }
  }
}

export class CreateNodeAction implements Action{
  private created_node: NodeElement;

  constructor(private node_layer: DiagramNodesLayer,
              private node_label: string,
              private node_x:number,
              private node_y:number){

  }

  execute(){
    let new_node = this.node_layer.createNewNode(this.node_label, this.node_x, this.node_y);
    // new_node.is_selected = true;
    this.created_node= new_node;

  }

  redo(){
    this.node_layer.addNode(this.created_node);
  }

  undo(){
    this.node_layer.deleteNode(this.created_node);
  }
}

export class ToggleNodeAcceptStateStatusAction implements Action{
  private readonly node: NodeElement;

  constructor(private node_layer: DiagramNodesLayer, node: NodeElement){
    this.node = node;
  }

  execute(){
    this.node.is_accept_state = !this.node.is_accept_state;
  }

  redo(){
    this.node.is_accept_state = !this.node.is_accept_state;
  }

  undo(){
    this.node.is_accept_state = !this.node.is_accept_state;
  }
}

export class MoveNodesAction implements Action{

  constructor(private nodes: NodeElement[],
              private translate_x: number,
              private translate_y: number){
  }

  execute(){
    // intentionally do nothing
    // For making the operation interactive
  }

  redo(){
    for(let node of this.nodes){
      node.translatePosition(this.translate_x, this.translate_y)
      // node.x += this.translate_x;
      // node.y += this.translate_y;
    }
  }

  undo(){
    for(let node of this.nodes){
      node.translatePosition(-1*this.translate_x, -1*this.translate_y)
      // node.x -= this.translate_x;
      // node.y -= this.translate_y;
    }
  }
}

// Actions performed on edges

export class CreateEdgeAction implements Action{

  constructor(private edge_layer: DiagramEdgeLayer, private edge: EdgeElement){

  }

  execute(){
    // edge is assumed to be created before hand
  }

  undo(){
    this.edge_layer.removeEdge(this.edge);
  }

  redo(){
    this.edge_layer.addEdge(this.edge);
  }
}

export class DeleteEdgeAction implements Action{

  private readonly deleted_edge: EdgeElement;

  constructor(private edge_layer: DiagramEdgeLayer, private edge: EdgeElement){
    this.deleted_edge = edge;
  }

  execute(){
    this.edge_layer.removeEdge(this.edge);
  }

  undo(){
    this.edge_layer.addEdge(this.deleted_edge);
  }

  redo(){
    this.edge_layer.removeEdge(this.deleted_edge);
  }
}
