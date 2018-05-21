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

  executeAction(action: Action){
    // important is important in case action.do() raises an exception
    action.do();
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
      action.do();
      this.done_actions.push(action);
    }
  }
}

// action classes that encapsulate logic for manipulating the diagram

export interface Action{

  do();

  undo();
}

export class DeleteSelectedNodesAction implements Action{
  deleted_nodes: NodeElement[];

  constructor(private node_layer: DiagramNodesLayer){
    this.deleted_nodes = node_layer.getSelectedNodes();
  }

  do(){
    this.node_layer.deleteNodes(this.deleted_nodes);
  }

  undo(){
   this.node_layer.addNodes(this.deleted_nodes);
  }
}

