import * as createjs from 'createjs-module';
import {DiagramDirector} from './diagram-directors';

class Node {
  name: string= 'N/A';

}

class DFA {
  adjacent_nodes: Node[]= [];

}


export class NodeElement extends createjs.Container{
  selection_border: createjs.Shape;
  readonly NODE_RADIUS: number = 40;

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
    this.addChild(circle, circle_border, node_label, this.selection_border);

    this.setEventListeners();
  }

  setEventListeners(){
    // this.on('click', (event: any)=>{
    //   console.log('node click');
    // });
  }

  showSelectionBorder(){
    this.selection_border.alpha= 1;
  }

  hideSelectionBorder(){
    this.selection_border.alpha= 0;
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
    this.layer_hit_area.on('click', (event) => {console.log('SelectionLayer Click')});

    // on double click, create new node at the given point
    this.on('dblclick', (event: any)=>{
      console.log('Selection layer double Click');
      this.director.createNode('New', event.stageX, event.stageY);
    });
  }

}

// for handling nodes
export class DiagramNodesLayer extends createjs.Container{
  readonly NODE_RADIUS: number = 40;
  nodes: NodeElement[]= [];
  selected_nodes: NodeElement[]= [];

  constructor(private director: DiagramDirector, width: number, height: number) {
    super();

    this.createNewNode('area',80,80);
    this.createNewNode('area', 60,300);
    this.setEvenListeners();
  }

  createNewNode(label, x, y){
    let new_node = new NodeElement(label, x, y);
    this.nodes.push(new_node);
    this.addChild(new_node);

    this.setEventListenersToNode(new_node);
  }

  setEvenListeners(){

    // this.on('click', (event) => {console.log('SelectionLayer Click')});
  }

  setEventListenersToNode(node: NodeElement){
    // add click listener
    node.on('click', (event: any) => {
      // console.log('Node Click');

      this.director.toggleNodeSelection(event.currentTarget);
    });

    // node.on('pressup', (event) => {console.log('Node pressup')});


    // IMPORTANT: This method expects the target element to have drag_offset set to where mouse was first clicked (should be set by mousedown event handler)
    // enable drag and drop functionality
    node.on('pressmove', (event: any) =>{
      event.currentTarget.x = event.stageX - event.currentTarget.drag_offset.x;
      event.currentTarget.y = event.stageY - event.currentTarget.drag_offset.y;

      this.director.updateDiagram();
    });

    node.on('mousedown', (event: any) =>{
      // console.log('mouse down');
      event.currentTarget.drag_offset = {x : event.localX, y: event.localY};
    });
  }

  toggleNodeSelection(node: NodeElement){

    let idx = this.selected_nodes.findIndex(value => value === node);
    if(idx != -1){
      node.hideSelectionBorder();
      this.selected_nodes.splice(idx, 1);
    }
    else{
      node.showSelectionBorder();
      this.selected_nodes.push(node);
    }

    this.director.updateDiagram();
  }

  deselectAllNodes(){
    this.selected_nodes.forEach(x => x.hideSelectionBorder());
    this.selected_nodes.splice(0, this.selected_nodes.length);
  }
}

export class DFADiagram {
  ctrl_is_pressed: boolean= false;
  readonly director: DiagramDirector;
  readonly stage: createjs.Stage;    // Easeljs stage
  readonly background: createjs.Shape;
  readonly nodes_layer: DiagramNodesLayer;
  readonly selection_rect_layer: DiagramSelectionLayer;

  constructor(canvas: HTMLCanvasElement){
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
}
