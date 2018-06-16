import {NodeElement} from '../automata-diagram/diagram-layers/node-element';
import {Selectable} from './selectable.model';

export class Node implements Selectable{
  readonly label: string;
  readonly is_accept_state: boolean;

  constructor(label: string, is_accept_state: boolean= false){
    this.label = label;
    this.is_accept_state = is_accept_state;
  }


  // create a node model object from a node element object
  static NodeFactory(node: NodeElement):Node {
    return new Node(node.label, node.is_accept_state);
  }
}
