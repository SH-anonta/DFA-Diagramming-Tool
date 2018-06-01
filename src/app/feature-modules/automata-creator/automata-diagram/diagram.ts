import * as createjs from 'createjs-module';
import {DiagramSelectionLayer} from './diagram-layers/selection-layer';
import {DiagramDirector} from './diagram-director/diagram-director';
import {DiagramNodesLayer} from './diagram-layers/node-layer';
import {DiagramEdgeLayer} from './diagram-layers/edge-layer';
import {ExternalCommandsHandler} from './diagram-director/diagram-controls';


export class DFADiagram implements ExternalCommandsHandler{
  ctrl_is_pressed: boolean= false;
  shift_is_pressed: boolean= false;

  // class for controlling all the parts of the diagram
  // readonly director: DiagramDirectorDefaultMode;
  readonly director: DiagramDirector;

  // different classes that make up the diagram
  readonly stage: createjs.Stage;    // Easeljs stage
  readonly background: createjs.Shape;
  readonly nodes_layer: DiagramNodesLayer;
  readonly selection_rect_layer: DiagramSelectionLayer;
  readonly edge_layer: DiagramEdgeLayer;


  constructor(private canvas: HTMLCanvasElement){
    this.stage = new createjs.Stage(canvas);

    let canvas_width = (<any>this.stage.canvas).scrollWidth;
    let canvas_height= (<any>this.stage.canvas).scrollHeight;

    this.background = this.createBackGround();
    this.edge_layer = new DiagramEdgeLayer();
    this.selection_rect_layer = new DiagramSelectionLayer(canvas_width, canvas_height);
    this.nodes_layer = new DiagramNodesLayer(canvas_width, canvas_height);

    this.director= new DiagramDirector(this.stage, this, this.selection_rect_layer, this.nodes_layer, this.edge_layer);
    this.selection_rect_layer.setDirector(this.director);
    this.nodes_layer.setDirector(this.director);
    this.edge_layer.setDirector(this.director);

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


      // todo: remove, mode switching of diagram director should be set from outside
      if(event.keyCode == 16){
        // if the shift button was pressed
        this.director.switchMode(this.director.edge_creation_mode)
      }
    });

    document.addEventListener('keyup', (event: any) =>{
      this.ctrl_is_pressed = event.ctrlKey;
      this.shift_is_pressed = event.shiftKey;
      // console.log('ctrl up');

      // todo: remove, mode switching of diagram director should be set from outside
      if(event.keyCode == 16){
        // if the shift button was released,
        this.director.switchMode(this.director.default_mode)
      }
    });
  }

  undoChanges(){
    this.director.undoChanges();
  }
  redoChanges(){
    this.director.redoChanges();
  }

}
