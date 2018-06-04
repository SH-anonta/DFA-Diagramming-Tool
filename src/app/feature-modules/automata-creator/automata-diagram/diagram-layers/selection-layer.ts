// all logic for selection of nodes
import {DiagramDirector} from '../diagram-director/diagram-director';
import * as createjs from "createjs-module";
import construct = Reflect.construct;


export class SelectionRect extends createjs.Container {
  private static DEFAULT_COLOR  ='#1a9cff';
  private static DEFAULT_OPACITY  = .5;

  private render_cmd= {
    rect_cmd : undefined,
  };

  constructor(x,y){
    super();
    // ---------------------------------------

    // this.x = x;
    // this.y = y;
    let rect = new createjs.Shape();

    this.render_cmd.rect_cmd = rect.graphics.beginFill('blue').rect(x,y,0,0).command;
    rect.graphics.endFill();

    rect.alpha  = .2;
    this.addChild(rect);
  }

  setTopLeftPoint(x, y){
    this.render_cmd.rect_cmd.x = x;
    this.render_cmd.rect_cmd.y = y;
  }

  setBottomRightPoint(x, y){
    // let point = this.globalToLocal(x, y);
    let point = {x: x, y: y};

    this.render_cmd.rect_cmd.w = point.x-this.render_cmd.rect_cmd.x;
    this.render_cmd.rect_cmd.h = point.y-this.render_cmd.rect_cmd.y;
  }
}

export class SelectionOverlayLayer extends createjs.Container {
  private selection_rect: SelectionRect;

  constructor(width: number, height: number){
    super();

    // let tt = new createjs.Shape();
    // // tt.graphics.setStrokeStyle(3);
    // tt.graphics.beginFill('red').rect(50, 80, 100, 100);
    // tt.alpha = .3;
    // // tt.graphics.endStroke();
    // this.addChild(tt);
  }

  createSelectionRectangle(x, y): SelectionRect{
    this.selection_rect = new SelectionRect(x, y);
    this.addChild(this.selection_rect);
    return this.selection_rect;
  }

  removeSelectionRectangle(){
    this.removeChild(this.selection_rect);
    this.selection_rect= undefined;
  }
}

// todo move all event listener logic to background layer class
export class DiagramSelectionLayer extends createjs.Container{
  private layer_hit_area: createjs.Shape;
  private director: DiagramDirector;

  constructor(width: number, height: number){
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

    this.layer_hit_area.on('pressup', (event: any) => {
       // console.log('SelectionLayer mouse up');
      this.director.selectionLayerMouseUp(event);
    });

    this.layer_hit_area.on('mousedown', (event: any) => {
      // console.log('SelectionLayer Click');
      this.director.selectionLayerPressDown(event);
    });

    this.layer_hit_area.on('pressmove', (event: any) => {
      // console.log('SelectionLayer Click');
      this.director.selectionLayerPressMove(event);
    });
  }


  setDirector(director: DiagramDirector){
    this.director = director;
  }
}
