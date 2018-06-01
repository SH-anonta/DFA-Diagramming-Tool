import {Action} from './actions';

export class ActionExecutor{
  // stacks for keeping track of what actions have been executed
  // this also allows easy implementation of undoChanges, redoChanges mechanisms
  private done_actions: Action[]= [];
  private undone_actions: Action[]= [];

  // Max size of undoChanges, redoChanges stacks
  readonly MAX_ACTION_HISTORY_COUNT= 100;

  private clearUndoneActions(){
    this.undone_actions.splice(0, this.undone_actions.length);
  }

  execute(action: Action){
    // important is important in case action.redoChanges() raises an exception
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
