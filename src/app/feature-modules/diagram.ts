import * as createjs from 'createjs-module';


class Node {
  name: string= 'N/A';

}

class DFA {
  adjacent_nodes: Node[]= [];

}


class NodeElement extends createjs.Container{
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


    this.hitArea = circle;
    this.addChild(circle, circle_border, node_label);



    this.setEventListeners();
  }

  setEventListeners(){
    this.on('click', (event: any)=>{
      console.log('node click');
    });
  }

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
  readonly NODE_RADIUS: number = 40;
  nodes: NodeElement[]= [];

  constructor(private parent_stage: createjs.Stage) {
    super();

    this.createNewNode(80,80);
    this.createNewNode(60,300);
  }

  createNewNode(x, y){
    let new_node = new NodeElement('Area', x, y);
    this.nodes.push(new_node);
    this.addChild(new_node);

    this.setEventListenersToNode(new_node);
  }


  setEventListenersToNode(node: NodeElement){
    // add click listener
    node.on('click', (event) => {console.log('Node Click')});


    // enable drag and drop functionality
    node.on('pressmove', (event: any) =>{
      event.currentTarget.x = event.stageX;
      event.currentTarget.y = event.stageY;
      this.parent_stage.update();
    });
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
    this.nodes_layer = new DiagramNodesLayer(this.stage);

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
