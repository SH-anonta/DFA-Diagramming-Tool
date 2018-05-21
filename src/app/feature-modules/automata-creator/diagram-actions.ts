import {DiagramNodesLayer, NodeElement} from './diagram';

export class ActionExecutor{
  // stacks for keeping track of what actions have been executed
  // this also allows easy implementation of undo, redo mechanisms
  private done_actions: Action[]= [];
  private undone_actions: Action[]= [];

  // Max size of undo, redo stacks
  readonly MAX_ACTION_HISTORY_COUNT= 50;

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

export class DeleteSelectedNodesAction implements Action{
  deleted_nodes: NodeElement[];

  constructor(private node_layer: DiagramNodesLayer){
    this.deleted_nodes = node_layer.getSelectedNodes();
  }

  execute(){
    this.node_layer.deleteNodes(this.deleted_nodes);
  }

  redo(){
    this.node_layer.deleteNodes(this.deleted_nodes);
  }

  undo(){
   this.node_layer.addNodes(this.deleted_nodes);
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
    this.created_node= this.node_layer.createNewNode(this.node_label, this.node_x, this.node_y);
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
