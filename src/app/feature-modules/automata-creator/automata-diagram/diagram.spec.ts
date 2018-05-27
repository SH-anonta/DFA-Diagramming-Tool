import {TestBed} from '@angular/core/testing';
import {DFADiagram, DiagramNodesLayer, DiagramSelectionLayer, NodeElement} from './diagram';


describe('DFA Diagram', ()=>{
  describe('Node Layer from AutomataCreator-Diagram', () => {

    beforeEach(() => {
      this.director = jasmine.createSpy('director');
      this.node_layer = new DiagramNodesLayer(this.director, 1000, 1000);

      this.node1_label = 'Node1';
      this.node1_x = 60;
      this.node1_y = 80;

      this.node2_label = 'Node2';
      this.node2_x = 20;
      this.node2_y = 90;

      this.node1 = this.node_layer.createNewNode(this.node1_label, this.node1_x, this.node1_y);
      this.node2 = this.node_layer.createNewNode(this.node2_label, this.node2_x, this.node2_y);
    });

    it('Should starts off with empty node list', ()=>{

      // the node_layer object created at beforeEach has some nodes pre inserted for convenience of other tests
      // so this spec does not the mentioned node_layer object, instead creates a new one
      let fake_director: any = jasmine.createSpy('director');
      let new_node_layer = new DiagramNodesLayer(fake_director, 1000,1000);

      expect(new_node_layer.getAllNodes().length).toEqual(0);
    });

    it('Should create nodes successfully', () =>{


      // nodes are added to nodes list
      expect(this.node_layer.getAllNodes().length).toEqual(2);

      // passed values are correctly used for creating nodes
      expect(this.node1.label).toEqual(this.node1_label);
      expect(this.node1.x).toEqual(this.node1_x);
      expect(this.node1.y).toEqual(this.node1_y);
    });

    it('Should add new nodes', () =>{

      this.node_layer.addNode(this.node1);
      this.node_layer.addNode(this.node2);

      expect(this.node_layer.getAllNodes().length).toEqual(2);

      // expect(node1.label).toEqual(node1_label);
      expect(this.node1.x).toEqual(this.node1_x);
      expect(this.node1.y).toEqual(this.node1_y);
    });

    it('Should add multiple new nodes', () =>{

      this.node_layer.addNodes([this.node1, this.node2]);

      expect(this.node_layer.getAllNodes().length).toEqual(2);

      // expect(node1.label).toEqual(node1_label);
      expect(this.node1.x).toEqual(this.node1_x);
      expect(this.node1.y).toEqual(this.node1_y);
    });

    it('Should select all nodes', () =>{
      this.node_layer.selectAllNodes();

      expect(this.node1.is_selected).toBeTruthy();
      expect(this.node2.is_selected).toBeTruthy();
    });

    it('Should deselect all nodes', () =>{
      this.node1.is_selected= true;
      this.node2.is_selected= true;

      this.node_layer.addNodes([this.node1, this.node2]);
      this.node_layer.deselectAllNodes();

      expect(this.node1.is_selected).toBeFalsy();
      expect(this.node2.is_selected).toBeFalsy();
    });

    it('Should delete selected nodes', () =>{
      this.node1.is_selected= true;
      this.node_layer.addNodes([this.node1, this.node2]);
      this.node_layer.deleteSelectedNodes();

      let remaining_nodes:NodeElement[] = this.node_layer.getAllNodes();

      expect(remaining_nodes.length).toEqual(1);

      // node1 was selected and deleted, the remaining node should be node2
      expect(remaining_nodes[0] === this.node2).toBeTruthy();
    });

    it('Should delete specified node', () =>{
      this.node_layer.addNodes([this.node1, this.node2]);
      this.node_layer.deleteNode(this.node1);

      let remaining_nodes:NodeElement[] = this.node_layer.getAllNodes();

      expect(remaining_nodes.length).toEqual(1);

      // node1 was selected and deleted, the remaining node should be node2
      expect(remaining_nodes[0] === this.node2).toBeTruthy();
    });

    it('Should delete specified nodes', () =>{
      this.node_layer.addNodes([this.node1, this.node2]);
      this.node_layer.deleteNodes([this.node1]);

      let remaining_nodes:NodeElement[] = this.node_layer.getAllNodes();

      expect(remaining_nodes.length).toEqual(1);

      // node1 was selected and deleted, the remaining node should be node2
      expect(remaining_nodes[0] === this.node2).toBeTruthy();
    });

    it('Should return selected nodes', () =>{
      this.node1.is_selected= true;
      this.node_layer.addNodes([this.node1, this.node2]);

      let selected_nodes = this.node_layer.getSelectedNodes();

      expect(selected_nodes.length).toEqual(1);
      expect(selected_nodes[0] === this.node1).toBeTruthy();
    });

    it('Should translate (the position) of the selected nodes', () =>{
      this.node1.is_selected= true;
      this.node_layer.addNodes([this.node1, this.node2]);


      // how much to translate in x and y axis
      let tx= 40;
      let ty= -40;

      this.node_layer.translateSelectedNodes(tx, ty);

      // unselected node should not have changed
      expect(this.node2.x).toEqual(this.node2_x);
      expect(this.node2.y).toEqual(this.node2_y);

      // selected node should have changed
      expect(this.node1.x).toEqual(this.node1_x+tx);
      expect(this.node1.y).toEqual(this.node1_y+ty);
    });
  });

  describe('NodeElement', ()=>{

    beforeEach(()=>{
      this.node1_label = 'Node1';
      this.node1_x = 60;
      this.node1_y = 80;

      this.node1 = new NodeElement(this.node1_label, this.node1_x, this.node1_y);
    });

    it('Should create Node', () =>{
      let node1_label = 'Node1';
      let node1_x = 60;
      let node1_y = 80;

      let node1 = new NodeElement(node1_label, node1_x, node1_y);

      // expect(node1.label).toEqual(node1_label);
      expect(node1.x).toEqual(node1_x);
      expect(node1.y).toEqual(node1_y);

    });

    it('Should be selectable', () =>{
      this.node1.is_selected = true;
      expect(this.node1.is_selected).toBeTruthy();

      this.node1.is_selected = false;
      expect(this.node1.is_selected).toBeFalsy();
    });

    it('Should toggle between accept state and non accept state', () =>{
      this.node1.is_accept_state = true;
      expect(this.node1.is_accept_state).toBeTruthy();

      this.node1.is_accept_state = false;
      expect(this.node1.is_accept_state).toBeFalsy();
    });

  });

  describe('SelectionLayer', function () {
    it('Should be creatable', ()=>{
      let director:any = jasmine.createSpy('DiagramDirector');
      let temp = new DiagramSelectionLayer(director, 100, 100);
    });
  });
});

