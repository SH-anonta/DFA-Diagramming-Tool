import {TestBed} from '@angular/core/testing';
import {DFADiagram, DiagramNodesLayer} from './diagram';

describe('Node Layer from AutomataCreator-Diagram', () => {

  beforeEach(() => {

    this.director = jasmine.createSpy('director');
    this.node_layer = new DiagramNodesLayer(this.director, 1000, 1000);
  });

  it('Should create nodes successfully', () =>{
    let node1_label = 'Node1';
    let node1_x = 'Node1';
    let node1_y = 'Node1';

    let node1 = this.node_layer.createNewNode(node1_label , node1_x, node1_y);
    let node2 = this.node_layer.createNewNode('Node2', 50,59);

    // nodes are added to nodes list
    expect(this.node_layer.getAllNodes().length).toEqual(2);

    // passed values are correctly used for creating nodes
    expect(node1.label).toEqual(node1_label);
    expect(node1.x).toEqual(node1_x);
    expect(node1.x).toEqual(node1_y);
  });
});
