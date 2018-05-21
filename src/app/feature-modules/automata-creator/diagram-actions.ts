import {DiagramNodesLayer, NodeElement} from './diagram';

export class ActionExecutor{
  // stacks for keeping track of what actions have been executed
  // this also allows easy implementation of undo, redo mechanisms
  done_actions: Action[]= [];
  undone_actions: Action[]= [];

  // Max size of undo, redo stacks
  readonly MAX_ACTION_HISTORY_COUNT= 50;

  executeAction(action: Action){
    // important is important in case action.do() raises an exception
    action.do();
    this.done_actions.push(action);
  }

  undo(){
    if(this.undone_actions.length > 0){
      let action:Action = this.done_actions.pop();
      action.undo();
      this.undone_actions.push(action);
    }

  }

  redo(){
    if(this.undone_actions.length > this.MAX_ACTION_HISTORY_COUNT){
      // if max history limit will be crossed, discard the oldest action
      this.done_actions.splice(0, 1);
    }
    if(this.done_actions.length > 0) {
      let action: Action = this.undone_actions.pop();
      action.undo();
      this.done_actions.push(action);
    }
  }
}

// action classes that encapsulate logic for manipulating the diagram

export interface Action{

  do();

  undo();
}

class DeleteNodeAction implements Action{
  constructor(private node_layer: DiagramNodesLayer, private node: NodeElement){
  }

  do(){
    this.node_layer.deleteNode(this.node);
  }

  undo(){
   this.node_layer.addNode(this.node);
  }
}

