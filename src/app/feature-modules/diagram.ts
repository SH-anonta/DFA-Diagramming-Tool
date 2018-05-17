import * as createjs from 'createjs-module';


class Node {
  name: string= 'N/A';

}

class DFA {
  adjacent_nodes: Node[]= [];

}

// all logic for selection of nodes
class DiagramSelectionLayer extends createjs.Container{
  layer_hit_area: createjs.Shape;

  constructor(x: number, y: number, width: number, height: number){
    super();

    // define real shape to be transparent rectangle
    this.layer_hit_area = new createjs.Shape();
    this.layer_hit_area.graphics.setStrokeStyle(2).beginStroke("#000").rect(x, y, width, height);

    // define shape to use as hit area (opaque)
    let hit_area = new createjs.Shape();
    hit_area.graphics.beginFill("#000").rect(x, y, width, height);
    this.layer_hit_area.hitArea= hit_area;

    this.setEventListeners();
    this.addChild(this.layer_hit_area);
  }

  setEventListeners(){
    this.layer_hit_area.on('click', (event) => {console.log('SelectionLayer Click')});
  }

}

// for handling nodes
class DiagramNodesLayer extends createjs.Container{
  readonly NODE_RADIUS: number = 50;
  nodes: createjs.Shape[]= [];

  constructor() {
    super();

    this.createNewNode(80,80);
  }

  createNewNode(x, y){
    let circle = new createjs.Shape();

    circle.graphics.beginFill('white').drawCircle(x, y, this.NODE_RADIUS);

    this.addChild(circle);
    this.nodes.push(circle);
  }

}

export class DFADiagram {
  readonly stage: createjs.Stage;    // Easeljs stage
  readonly background: createjs.Shape;
  readonly nodes_layer: createjs.Container;
  readonly selection_rect_layer: createjs.Container;

  constructor(canvas: HTMLCanvasElement){
    this.stage = new createjs.Stage(canvas);

    let canvas_width = (<any>this.stage.canvas).scrollWidth;
    let canvas_height= (<any>this.stage.canvas).scrollHeight;

    this.selection_rect_layer = new DiagramSelectionLayer(0,0, canvas_width, canvas_height);
    this.background = this.createBackGround();
    this.nodes_layer = new DiagramNodesLayer();

    this.stage.addChild(this.selection_rect_layer);
    this.stage.addChild(this.background);
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
}
