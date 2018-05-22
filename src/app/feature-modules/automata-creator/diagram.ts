import * as createjs from 'createjs-module';
import {DiagramDirector} from './diagram-directors';
import {forEach} from '@angular/router/src/utils/collection';

class Node {
  name: string= 'N/A';

}

class DFA {
  adjacent_nodes: Node[]= [];

}

// This class listens to key events and
class EventFlags{

}

export class NodeElement extends createjs.Container{
  selection_border: createjs.Shape;     // circle border that indicates the node is selected
  accept_state_symbol: createjs.Shape;  // an inner circle that indicates the node is an accept state

  // constants
  readonly NODE_RADIUS: number = 40;


  // accept state status, changing the value of this property also changes the diagram
  private _is_accept_state: boolean= false;
  set is_accept_state(val: boolean){
    this._is_accept_state = val;
    this.accept_state_symbol.alpha= val ? 1 : 0;
  }
  get is_accept_state(): boolean{ return this._is_accept_state; }

  // node selection logic, changing the value of this property also changes the diagram
  private _is_selected: boolean= false;
  set is_selected(val: boolean){
    this._is_selected = val;
    this.selection_border.alpha= val ? 1 : 0;
  }
  get is_selected(){return this._is_selected;}

  constructor(private label: string, pos_x, pos_y){
    super();


    // main circle of the node
    let circle = new createjs.Shape();
    circle.graphics.beginFill('white').drawCircle(0, 0, this.NODE_RADIUS);
    this.x = pos_x;
    this.y = pos_y;

    // circle border
    let circle_border = new createjs.Shape();
    circle_border.graphics.setStrokeStyle(1).beginStroke('black').drawCircle(0, 0, this.NODE_RADIUS);
    this.x = pos_x;
    this.y = pos_y;

    // accept state border
    this.accept_state_symbol = new createjs.Shape();
    this.accept_state_symbol.graphics.setStrokeStyle(1).beginStroke('black').drawCircle(0, 0, this.NODE_RADIUS-5);
    this.accept_state_symbol.alpha= 0;
    this.x = pos_x;
    this.y = pos_y;

    // label of node
    let node_label = new createjs.Text(label, "bold 15px Arial", "black");
    node_label.set({
      textAlign: "center",
      textBaseline: "middle",
      font_size: 20,
    });

    // selection border
    this.selection_border = new createjs.Shape();
    this.selection_border.graphics.setStrokeStyle(2).beginStroke('blue').drawCircle(0, 0, this.NODE_RADIUS);
    this.selection_border.alpha= 0;
    this.x = pos_x;
    this.y = pos_y;


    this.hitArea = circle;
    this.addChild(circle, circle_border, node_label, this.selection_border, this.accept_state_symbol);

    this.setEventListeners();
  }
  setEventListeners(){
    // this.on('click', (event: any)=>{
    //   console.log('node click');
    // });
  }
}

// all logic for selection of nodes
export class DiagramSelectionLayer extends createjs.Container{
  layer_hit_area: createjs.Shape;

  constructor(private director: DiagramDirector, width: number, height: number){
    super();

    // define real shape to be transparent rectangle
    this.layer_hit_area = new createjs.Shape();
    this.layer_hit_area.graphics.setStrokeStyle(2).beginStroke("#000").rect(0,0, width, height);

    // define shape to use as hit area (opaque)
    let hit_area = new createjs.Shape();
    hit_area.graphics.beginFill("#000").rect(0,0 , width, height);
    this.layer_hit_area.hitArea= hit_area;

    this.setEventListeners();
    this.addChild(this.layer_hit_area);
  }

  setEventListeners(){
    this.layer_hit_area.on('click', (event: any) => {
      // console.log('SelectionLayer Click');
      this.director.selectionLayerClicked(event);
    });

    // on double click, create new node at the given point
    this.on('dblclick', (event: any)=>{
      // console.log('Selection layer double Click');
      this.director.selectionLayerDoubleClicked(event);
    });
  }

}

// for handling nodes
export class DiagramNodesLayer extends createjs.Container{
  private nodes: NodeElement[]= [];
  // selected_nodes: NodeElement[]= [];

  constructor(private director: DiagramDirector, width: number, height: number) {
    super();
    // this.createNewNode('area',80,80);
    // this.createNewNode('area', 60,300);
  }

  createNewNode(label, x, y): NodeElement{
    let new_node = new NodeElement(label, x, y);
    this.nodes.push(new_node);
    this.addChild(new_node);

    this.setEventListenersToNode(new_node);

    return new_node
  }

  addNode(node: NodeElement) {
    // prevent same node from being inserted twice
    if(this.nodes.findIndex(x => {return x === node;}) == -1){
      this.nodes.push(node);
      this.addChild(node);
    }

  }

  addNodes(nodes: NodeElement[]) {
    for(let x of nodes){
      this.addNode(x);
    }
  }

  getAllNodes(): NodeElement[]{
    return this.nodes;
  }
  // all event response task is delegated to a mediator class (DiagramDirector)
  setEventListenersToNode(node: NodeElement){
    // add click listener
    node.on('click', (event: any) => {
      // console.log('Node Click');
      this.director.nodeClicked(event);
    });

    node.on('dblclick', (event: any) => {
      // console.log('Node dbl Click');
      this.director.nodeDoubleClicked(event.currentTarget)
    });
    // node.on('pressup', (event) => {console.log('Node pressup')});


    // IMPORTANT: This method expects the target element to have drag_offset set to where mouse was first clicked (should be set by mousedown event handler)
    // enable drag and drop functionality
    node.on('pressmove', (event: any) =>{
      this.director.nodePressMove(event);
    });

    node.on('pressup', (event: any) =>{
      // console.log('mouse down');
      this.director.nodePressUp(event);
    });

    node.on('mousedown', (event: any) =>{
      // console.log('mouse down');
      this.director.nodeMouseDown(event);
    });
  }

  deselectAllNodes(){
    this.nodes.forEach(x => x.is_selected = false);
  }

  deleteSelectedNodes(){
    for(let node of this.nodes){
      if(node.is_selected){
        this.removeChild(node);
      }
    }

    // only keep the nodes that were not selected before deletion
    this.nodes = this.nodes.filter((node: NodeElement)=> { return !node.is_selected} );
  }

  deleteNode(node: NodeElement) {
    let idx = this.nodes.findIndex(x => {return x === node});

    if(idx != -1){
      this.nodes.splice(idx, 1);
      this.removeChild(node);
    }

  }

  deleteNodes(nodes: NodeElement[]){
    for(let x of nodes){
      this.deleteNode(x);
    }
  }

  getSelectedNodes() {
    return this.nodes.filter(x => {return x.is_selected;});
  }

  translateSelectedNodes(x: number, y: number){
    for(let node of this.nodes){
      if(node.is_selected){
        node.x+= x;
        node.y+= y;
      }
    }
  }

}

export class DFADiagram {
  ctrl_is_pressed: boolean= false;
  readonly director: DiagramDirector;
  readonly stage: createjs.Stage;    // Easeljs stage
  readonly background: createjs.Shape;
  readonly nodes_layer: DiagramNodesLayer;
  readonly selection_rect_layer: DiagramSelectionLayer;

  constructor(private canvas: HTMLCanvasElement){
    this.stage = new createjs.Stage(canvas);
    this.director= new DiagramDirector(this.stage, this);

    let canvas_width = (<any>this.stage.canvas).scrollWidth;
    let canvas_height= (<any>this.stage.canvas).scrollHeight;

    this.selection_rect_layer = new DiagramSelectionLayer(this.director, canvas_width, canvas_height);
    this.background = this.createBackGround();
    this.nodes_layer = new DiagramNodesLayer(this.director, canvas_width, canvas_height);

    this.director.setNodeLayer(this.nodes_layer);
    this.director.setSelectionLayer(this.selection_rect_layer);

    this.stage.addChild(this.background);
    this.stage.addChild(this.selection_rect_layer);
    this.stage.addChild(this.nodes_layer);

    this.setEventListeners();

    this.stage.update();
  }

  // diagram initialization methods
  private createBackGround(): createjs.Shape {
    let background = new createjs.Shape();
    let canvas_width = (<any>this.stage.canvas).scrollWidth;
    let canvas_height= (<any>this.stage.canvas).scrollHeight;

    background.x = background.y = 0;
    background.graphics.beginFill('#f5f5ff').drawRect(0,0,canvas_width, canvas_height);

    return background;
  }

  ctrlPressed() {
    this.ctrl_is_pressed= true;
  }

  ctrlReleased() {
    this.ctrl_is_pressed= false;
  }

  private setEventListeners() {
    // this.canvas.addEventListener('keydown', (event: KeyboardEvent)=>{
    document.addEventListener('keydown', (event: KeyboardEvent)=>{
      // console.log(event);
      // check if delete key is pressed

      // execute only if the delete is not pressed in an input element
      if(event.target !== document.body){
        return;
      }

      if(event.keyCode === 46){
        // console.log('Delete pressed');
        this.director.deleteButtonPressedOnPageBody();
      }
      else if(event.ctrlKey && event.key == 'z'){
        this.director.ctrlZPressed();
      }
      else if(event.ctrlKey && event.key == 'y'){
        this.director.ctrlYPressed();
      }

    });
  }
}
