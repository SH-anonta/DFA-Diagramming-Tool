import * as createjs from 'createjs-module';
import {DiagramSelectionLayer} from './selection-layer';
import {DiagramDirectorDefaultMode} from './diagram-directors';
import {DiagramNodesLayer} from './node-layer';
import {DiagramEdgeLayer} from './edge-layer';


export class DFADiagram {
  ctrl_is_pressed: boolean= false;
  shift_is_pressed: boolean= false;

  // class for controlling all the parts of the diagram
  readonly director: DiagramDirectorDefaultMode;

  // different classes that make up the diagram
  readonly stage: createjs.Stage;    // Easeljs stage
  readonly background: createjs.Shape;
  readonly nodes_layer: DiagramNodesLayer;
  readonly selection_rect_layer: DiagramSelectionLayer;
  readonly edge_layer: DiagramEdgeLayer;


  constructor(private canvas: HTMLCanvasElement){
    this.stage = new createjs.Stage(canvas);
    this.director= new DiagramDirectorDefaultMode(this.stage, this);

    let canvas_width = (<any>this.stage.canvas).scrollWidth;
    let canvas_height= (<any>this.stage.canvas).scrollHeight;

    this.edge_layer = new DiagramEdgeLayer();
    this.selection_rect_layer = new DiagramSelectionLayer(this.director, canvas_width, canvas_height);
    this.background = this.createBackGround();
    this.nodes_layer = new DiagramNodesLayer(this.director, canvas_width, canvas_height);

    this.director.setEdgeLayer(this.edge_layer);
    this.director.setNodeLayer(this.nodes_layer);
    this.director.setSelectionLayer(this.selection_rect_layer);

    // order of insertion is important here
    // If layer a is added after b, a will be on top of b
    this.stage.addChild(this.background);
    this.stage.addChild(this.selection_rect_layer);
    this.stage.addChild(this.edge_layer);
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


    // The custom events emitted by createjs library does not support keyevents
    // Warning: inefficient
    document.addEventListener('keydown', (event: any) =>{
      this.ctrl_is_pressed = event.ctrlKey;
      this.shift_is_pressed = event.shiftKey;
    });

    document.addEventListener('keyup', (event: any) =>{
      this.ctrl_is_pressed = event.ctrlKey;
      this.shift_is_pressed = event.shiftKey;
      // console.log('ctrl up');
    });
  }
}
